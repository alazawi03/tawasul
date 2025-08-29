const fs = require('fs');
const path = require('path');

// Read the original prayer times file
const prayerTimesPath = path.join(__dirname, '..', 'prayer_times', 'prayer_times_2025.js');
const outputPath = path.join(__dirname, '..', 'client', 'src', 'data', 'prayerTimes2025.json');

function convertPrayerTimesToJSON() {
    try {
        // Read the original file
        const fileContent = fs.readFileSync(prayerTimesPath, 'utf8');
    
        // Extract JS_TIMES array from the file
        const jsTimesMatch = fileContent.match(/var JS_TIMES =\s*\[([\s\S]*?)\];/);
        
        if (!jsTimesMatch) {
            throw new Error('Could not find JS_TIMES array in the file');
        }
    
        const timesString = jsTimesMatch[1];
        const timesArray = timesString
            .split('\n')
            .map(line => line.trim().replace(/[",]/g, ''))
            .filter(line => line && line.length > 0 && !line.startsWith('--'));
            
        const prayerTimesJSON = {};
    
        // Process each line
        timesArray.forEach(line => {
            if (line.includes('~~~~~') && line.includes('|')) {
                const parts = line.split('~~~~~');
                if (parts.length === 2) {
                    const dateKey = parts[0];
                    const times = parts[1].split('|');

                    if (times.length === 6) {
                        prayerTimesJSON[dateKey] = {
                            fajr: times[0],
                            sunrise: times[1],
                            dhuhr: times[2],
                            asr: times[3],
                            maghrib: times[4],
                            isha: times[5]
                        };
                    }
                }
            }
        });
    
        // Create the data directory if it doesn't exist
        const dataDir = path.dirname(outputPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
    
        // Write the JSON file
        fs.writeFileSync(outputPath, JSON.stringify(prayerTimesJSON, null, 2), 'utf8');
        
        console.log('✅ Prayer times successfully converted to JSON!');
        console.log(`📁 Output file: ${outputPath}`);
        console.log(`📊 Total entries: ${Object.keys(prayerTimesJSON).length}`);
    
        // Show a sample of the converted data
        const sampleEntries = Object.entries(prayerTimesJSON).slice(0, 3);
        console.log('\n📋 Sample entries:');
        sampleEntries.forEach(([date, times]) => {
            console.log(`${date}: Fajr ${times.fajr}, Maghrib ${times.maghrib}`);
        });
    
    } catch (error) {
        console.error('❌ Error converting prayer times:', error.message);
        process.exit(1);
    }
}

// Run the conversion
convertPrayerTimesToJSON();