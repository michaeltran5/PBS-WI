<?php
/**
 * Convert TP Media IDs to CIDs using PBS Media Manager API Client
 * and generate AWS Personalize format CSV
 */

// Include the PBS Media Manager API Client
require_once 'PBS_Media_Manager_API_Client.php';

// Configuration
$input_file = 'WPNE_1_Cleaned_Updated.csv';
$output_file = 'aws_personalize_data.csv';

// Load environment variables from .env file (one folder outside)
function loadEnv() {
    $envPath = dirname(__DIR__) . '/.env';
    
    if (!file_exists($envPath)) {
        die(".env file not found at $envPath\n");
    }
    
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // Parse the line
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        // Remove quotes if present
        if (strpos($value, '"') === 0 || strpos($value, "'") === 0) {
            $value = trim($value, '"\'');
        }
        
        // Set as environment variable
        putenv("$name=$value");
    }
}

// Load environment variables
loadEnv();

// Get PBS API credentials from environment variables
$PBS_API_KEY = getenv('PBS_CLIENT_ID');
$PBS_API_SECRET = getenv('PBS_CLIENT_SECRET');
$PBS_API_BASE_URL = getenv('PBS_API_BASE_URL') ?: 'https://media.services.pbs.org/api/v1';

if (empty($PBS_API_KEY) || empty($PBS_API_SECRET)) {
    die("PBS API credentials not found in .env file. Please make sure PBS_API_KEY and PBS_API_SECRET are set.\n");
}

echo "Loaded PBS API credentials from .env file.\n";

// Initialize the PBS Media Manager API Client
$pbs_client = new PBS_Media_Manager_API_Client(
    $PBS_API_KEY,
    $PBS_API_SECRET,
    $PBS_API_BASE_URL
);

// Function to get CID from TP Media ID using PBS API
function get_cid_from_tp_media_id($tp_media_id, $pbs_client) {
    if (!empty($tp_media_id)) {
        try {
            // Use the get_asset_by_tp_media_id method from the PBS client
            $response = $pbs_client->get_asset_by_tp_media_id($tp_media_id);
            
            // Check if we got a valid response
            if (!empty($response['data']['id'])) {
                return $response['data']['id'];
            }
        } catch (Exception $e) {
            echo "Error fetching CID for TP Media ID $tp_media_id: " . $e->getMessage() . "\n";
        }
    }
    
    return null; // Return null if we couldn't get the CID
}

// Function to convert datetime to timestamp
function datetime_to_timestamp($datetime_str) {
    if (empty($datetime_str)) {
        return time(); // Return current time if input is empty
    }
    
    try {
        // Try to parse the datetime string
        $datetime = new DateTime($datetime_str);
        return $datetime->getTimestamp();
    } catch (Exception $e) {
        // Return current timestamp if parsing fails
        return time();
    }
}

// Open input file
if (!file_exists($input_file)) {
    die("Input file $input_file not found.\n");
}

$input = fopen($input_file, 'r');
if (!$input) {
    die("Could not open input file $input_file.\n");
}

// Create output file
$output = fopen($output_file, 'w');
if (!$output) {
    die("Could not create output file $output_file.\n");
}

// Write header to output file
fputcsv($output, [
    'USER_ID',
    'ITEM_ID',
    'TIMESTAMP',
    'EVENT_TYPE',
    'GENRE',
    'DEVICE',
    'TIME_WATCHED'
]);

// Read header from input file
$header = fgetcsv($input);
if (!$header) {
    die("Could not read header from input file.\n");
}

// Get column indices
$uid_idx = array_search('UID', $header);
$first_name_idx = array_search('First Name', $header);
$last_name_idx = array_search('Last Name', $header);
$email_idx = array_search('Email', $header);
$tp_media_id_idx = array_search('TP Media ID', $header);
$cid_idx = array_search('CID', $header);
$genre_idx = array_search('Genre', $header);
$device_idx = array_search('Device', $header);
$date_watched_idx = array_search('Date Watched', $header);
$time_watched_idx = array_search('Time Watched', $header);

// Check if required columns exist
if ($tp_media_id_idx === false) {
    die("TP Media ID column is missing from input file.\n");
}

echo "Starting conversion process...\n";

// Process each row
$row_count = 0;
$processed_count = 0;
$api_calls_count = 0;
$tp_media_to_cid_map = []; // Cache for TP Media ID to CID mappings

while (($row = fgetcsv($input)) !== false) {
    $row_count++;
    
    // Skip rows with empty TP Media ID
    if (!isset($row[$tp_media_id_idx]) || empty($row[$tp_media_id_idx])) {
        echo "Skipping row $row_count: No TP Media ID found\n";
        continue;
    }
    
    // Get TP Media ID
    $tp_media_id = $row[$tp_media_id_idx];
    
    // Check if CID column exists and has a value
    $cid = ($cid_idx !== false && isset($row[$cid_idx]) && !empty($row[$cid_idx])) ? $row[$cid_idx] : null;
    
    // If CID is empty, try to get it from cache or PBS API
    if (empty($cid)) {
        // First check the cache
        if (isset($tp_media_to_cid_map[$tp_media_id])) {
            $cid = $tp_media_to_cid_map[$tp_media_id];
            echo "Row $row_count: Found CID in cache for TP Media ID $tp_media_id: $cid\n";
        } else {
            // Call the API if not in cache
            echo "Row $row_count: Calling API for TP Media ID $tp_media_id...\n";
            $api_calls_count++;
            $cid = get_cid_from_tp_media_id($tp_media_id, $pbs_client);
            
            if ($cid) {
                // Store in cache
                $tp_media_to_cid_map[$tp_media_id] = $cid;
                echo "Row $row_count: API returned CID: $cid\n";
            } else {
                echo "Row $row_count: API call failed to retrieve CID for TP Media ID $tp_media_id\n";
            }
        }
    }
    
    // Skip rows with no CID
    if (empty($cid)) {
        echo "Skipping row $row_count: No CID found for TP Media ID $tp_media_id\n";
        continue;
    }
    
    // Get user ID (use UID if available, otherwise create from name and email)
    if ($uid_idx !== false && isset($row[$uid_idx]) && !empty($row[$uid_idx])) {
        $user_id = $row[$uid_idx];
    } 

    
    // Get timestamp from date watched
    $date_watched = ($date_watched_idx !== false && isset($row[$date_watched_idx])) ? $row[$date_watched_idx] : '';
    $timestamp = datetime_to_timestamp($date_watched);
    
    // Get event type (constant for now)
    $event_type = 'WATCH';
    
    // Get genre and device
    $genre = ($genre_idx !== false && isset($row[$genre_idx]) && !empty($row[$genre_idx])) ? $row[$genre_idx] : 'Unknown';
    $device = ($device_idx !== false && isset($row[$device_idx]) && !empty($row[$device_idx])) ? $row[$device_idx] : 'Unknown';
    
    // Get time watched
    $time_watched = ($time_watched_idx !== false && isset($row[$time_watched_idx]) && !empty($row[$time_watched_idx])) ? (float)$row[$time_watched_idx] : 0.0;
    
    // Write to output file
    fputcsv($output, [
        $user_id,
        $cid,
        $timestamp,
        $event_type,
        $genre,
        $device,
        $time_watched
    ]);
    
    $processed_count++;
    
    // Print progress every 100 rows
    if ($row_count % 100 === 0) {
        echo "Processed $row_count rows...\n";
    }
    
    // Add a small delay if we're making lots of API calls to avoid rate limiting
    if ($api_calls_count > 0 && $api_calls_count % 10 === 0) {
        echo "Pausing briefly to avoid API rate limiting...\n";
        sleep(1);
    }
}

// Close files
fclose($input);
fclose($output);

?>