<?php
//main api router
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$config = require_once "../../src/config/config.php";

require_once "../../src/PBS_Media_Manager_API_Client.php";

//api client instance
$client = new PBS_Media_Manager_API_Client(
    $config['pbs_api']['client_id'],
    $config['pbs_api']['client_secret'],
    $config['pbs_api']['base_url']
);

//make path into segments array
$path = $_SERVER['REQUEST_URI'] ?? '';
$path = parse_url($path, PHP_URL_PATH);
$path = trim(str_replace('/api', '', $path), '/');
$segments = explode('/', $path);

//api endpoint handlers
try {
    //route based on first segment
    switch ($segments[0]) {
        case 'assets':
            handleAssets($client, $segments);
            break;
        
        case 'shows':
            handleShows($client, $segments);
            break;
            
        case 'episodes':
            handleEpisodes($client, $segments);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

//handler for assets
function handleAssets($client, $segments) {
    if (count($segments) < 2) {
        //list assets if endpoint is here
        $queryargs = $_GET;
        $result = $client->get_assets($queryargs);
        echo json_encode($result);
        return;
    }
    
    //otherwise get specified asset
    $assetId = $segments[1];
    $queryargs = $_GET;
    $result = $client->get_asset($assetId, false, $queryargs);
    echo json_encode($result);
}

//handler for shows
function handleShows($client, $segments) {
    if (count($segments) < 2) {
        //list shows is endpoint is here
        $queryargs = $_GET;
        $result = $client->get_shows($queryargs);
        echo json_encode($result);
        return;
    }
    
    //otherwise get a specified show
    $showId = $segments[1];
    

    if (count($segments) >= 3) {
        switch ($segments[2]) {
            case 'episodes':
                //get episodes for show
                $seasons = $client->get_show_seasons($showId);
                
                //if no seasons get episodes directly
                if (empty($seasons)) {
                    $result = $client->get_child_items_of_type($showId, 'show', 'episode', $_GET);
                } else {
                    //get episodes from the first season
                    $seasonId = $seasons[0]['id'];
                    $result = $client->get_season_episodes($seasonId, $_GET);
                }
                break;
                
            case 'seasons':
                //get seasons for show
                $result = $client->get_show_seasons($showId, $_GET);
                break;
                
            case 'assets':
                //get assets for show
                $result = $client->get_show_assets($showId, 'all', 'all', $_GET);
                break;
                
            default:
                http_response_code(404);
                $result = ['error' => 'Resource type not found'];
        }
    } else {
        //get show details
        $result = $client->get_show($showId, $_GET);
    }
    
    echo json_encode($result);
}

//handler for episodes
function handleEpisodes($client, $segments) {
    if (count($segments) < 2) {
        http_response_code(400);
        echo json_encode(['error' => 'Episode ID required']);
        return;
    }
    
    $episodeId = $segments[1];
    
    //check for a specific resource type
    if (count($segments) >= 3) {
        switch ($segments[2]) {
            case 'assets':
                //get assets for this episode
                $result = $client->get_episode_assets($episodeId, 'all', 'all', $_GET);
                break;
                
            default:
                http_response_code(404);
                $result = ['error' => 'Resource type not found'];
        }
    } else {
        //get episode details
        $result = $client->get_episode($episodeId, $_GET);
    }
    
    echo json_encode($result);
}