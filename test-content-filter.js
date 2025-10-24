const { containsProhibitedWords } = require('./src/config/wordlist');
const { ServiceService } = require('./src/services/service.service');

// Test words
const testWords = [
  'sex',
  'terror',
  'fick dich',
  'fick mich',
  'bombe',
  'mord',
  'drogen',
  'normaler text',
  'service anbieten',
  'hilfe bei hausaufgaben',
  'terrorismus',
  'vergewaltigung',
  'kinderpornografie',
  'hitler',
  'nazi',
  'hurensohn',
  'arschloch'
];

async function testContentFilter() {
  console.log('🧪 Testing Content Filter API...\n');
  
  for (const word of testWords) {
    try {
      // Test 1: Direct wordlist check
      const wordlistResult = containsProhibitedWords(word);
      
      // Test 2: Service content filter (includes bad-words library)
      const serviceResult = await ServiceService.containsProhibitedContent(word);
      
      console.log(`📝 Text: "${word}"`);
      console.log(`   Wordlist Filter: ${wordlistResult ? '❌ BLOCKED' : '✅ ALLOWED'}`);
      console.log(`   Service Filter:  ${serviceResult ? '❌ BLOCKED' : '✅ ALLOWED'}`);
      console.log('');
      
    } catch (error) {
      console.log(`❌ Error testing "${word}": ${error.message}`);
    }
  }
  
  console.log('✅ Content filter testing completed!');
}

// Run the test
testContentFilter().catch(console.error);
