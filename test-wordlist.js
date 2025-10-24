const { containsProhibitedWords } = require('./src/config/wordlist');

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
  'arschloch',
  'cannabis',
  'heroin',
  'waffe',
  'pistole',
  'betrug',
  'geldwäsche',
  'menschenhandel',
  'pädophilie',
  'bombenanschlag',
  'selbstmordattentat',
  'mafia',
  'clan kriminalität',
  'hassrede',
  'rassismus',
  'tierquälerei',
  'hacking',
  'phishing',
  'ransomware'
];

function testWordlist() {
  console.log('🧪 Testing Wordlist Content Filter...\n');
  
  let blockedCount = 0;
  let allowedCount = 0;
  
  for (const word of testWords) {
    const isBlocked = containsProhibitedWords(word);
    
    if (isBlocked) {
      blockedCount++;
      console.log(`❌ BLOCKED: "${word}"`);
    } else {
      allowedCount++;
      console.log(`✅ ALLOWED: "${word}"`);
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`   Blocked: ${blockedCount}`);
  console.log(`   Allowed: ${allowedCount}`);
  console.log(`   Total: ${testWords.length}`);
  console.log(`   Block Rate: ${((blockedCount / testWords.length) * 100).toFixed(1)}%`);
  
  console.log('\n✅ Wordlist testing completed!');
}

// Run the test
testWordlist();
