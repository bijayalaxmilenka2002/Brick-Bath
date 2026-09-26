require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  const uri = process.env.MONGODB_URI;

  console.log('\n======================================================');
  console.log('   MONGODB ATLAS CONNECTION DIAGNOSTIC TOOL');
  console.log('======================================================\n');

  if (!uri || uri.trim() === '') {
    console.log('❌ MONGODB_URI is EMPTY in your .env file.');
    console.log('\n👉 HOW TO FIX:');
    console.log('1. Open your .env file in the root folder.');
    console.log('2. Set MONGODB_URI to your Atlas connection string:');
    console.log('   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bricknbath?retryWrites=true&w=majority');
    console.log('\n(Note: While empty, the app automatically runs on local SQLite fallback)\n');
    process.exit(1);
  }

  // Hide password in logged URI for security
  const maskedUri = uri.replace(/\/\/(.*):(.*)@/, '//$1:****@');
  console.log(`Connecting to: ${maskedUri} ...`);

  try {
    const startTime = Date.now();
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    const duration = Date.now() - startTime;

    console.log(`\n🎉 SUCCESS! Connected to MongoDB Atlas in ${duration}ms!`);
    console.log(`Database Name : ${mongoose.connection.name}`);
    console.log(`Host          : ${mongoose.connection.host}`);
    console.log(`State         : Ready & Connected (readyState: ${mongoose.connection.readyState})`);

    // Test a lightweight query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Collections   : ${collections.map(c => c.name).join(', ') || 'No collections yet (will be created automatically on first inquiry)'}`);

    console.log('\n✅ Your database is 100% properly connected and ready for production!');
    console.log('======================================================\n');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection Failed!\n');
    console.error(`Error Name    : ${error.name}`);
    console.error(`Error Message : ${error.message}\n`);

    console.log('🔍 TROUBLESHOOTING GUIDE FOR THIS ERROR:');
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.log('👉 CAUSE: Wrong Username or Password.');
      console.log('👉 FIX:');
      console.log('   1. In MongoDB Atlas, go to "Database Access".');
      console.log('   2. Verify your database username and click "Edit" to reset password if needed.');
      console.log('   3. If your password has special characters like @, #, $, encode them or use letters & numbers.');
    } else if (error.message.includes('queryTxt ETIMEOUT') || error.message.includes('Server selection timed out')) {
      console.log('👉 CAUSE: IP Whitelist blocking access OR Internet issue.');
      console.log('👉 FIX:');
      console.log('   1. Go to MongoDB Atlas -> "Network Access" in the left sidebar.');
      console.log('   2. Click "Add IP Address".');
      console.log('   3. Choose "Allow Access from Anywhere" (0.0.0.0/0).');
      console.log('   4. Wait 1 minute for Atlas to apply and run this test again.');
    } else {
      console.log('👉 Check that your MONGODB_URI format is:');
      console.log('   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bricknbath?retryWrites=true&w=majority');
    }
    console.log('\n======================================================\n');
    process.exit(1);
  }
}

testConnection();
