import Papa from 'papaparse';

let userDataMap: Record<string, string> = {};
let isDataLoaded = false;
let isLoadingInProgress = false;
const pendingCallbacks: Array<() => void> = [];

//row data stucture
interface CsvRow {
  'First Name'?: string;
  'Last Name'?: string;
  'Email'?: string;
  'UID'?: string;
  [key: string]: any;
}


export const loadUserData = async (): Promise<void> => {
  if (isDataLoaded) {
    return;
  }
  
  if (isLoadingInProgress) {
    return new Promise<void>(resolve => {
      pendingCallbacks.push(resolve);
    });
  }
  
  isLoadingInProgress = true;
  
  try {
    console.log('Loading user data from CSV...');
    
    const response = await fetch('/WPNE_1_Cleaned_Updated.csv');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV file: ${response.status} ${response.statusText}`);
    }
    
    const csvData = await response.text();
    
    userDataMap = {};
    
    Papa.parse<CsvRow>(csvData, {
      header: true,
      skipEmptyLines: true,
      step: function(results) {
        const row = results.data;
        const email = row['Email'];
        const uid = row['UID'];
        
        //store valid pairs
        if (email && uid) {
          const normalizedEmail = String(email).toLowerCase();
          userDataMap[normalizedEmail] = String(uid);
        }
      },
      complete: function() {
        isDataLoaded = true;
        isLoadingInProgress = false;
        console.log(`Loaded ${Object.keys(userDataMap).length} pairs`);
        
        pendingCallbacks.forEach(callback => callback());
        pendingCallbacks.length = 0;
      },
      error: function(error: Error) {
        console.error('Error parsing CSV:', error.message);
        isLoadingInProgress = false;
        
        pendingCallbacks.length = 0;
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error loading user data from CSV:', errorMessage);
    isLoadingInProgress = false;
    userDataMap = {};
  }
};

export const getUidByEmail = (email: string): string | null => {
  const normalizedEmail = email.toLowerCase();
  return userDataMap[normalizedEmail] || null;
};

export const isUserDataLoaded = (): boolean => {
  return isDataLoaded;
};