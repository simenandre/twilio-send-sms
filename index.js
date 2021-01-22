const YAML = require('yaml');

const invariant = (condition, msg) => {
  if (!condition) {
    throw new Error(msg);
  }
};

const checkConfigVar = (ref, what) => {
  invariant(ref, `${what} is missing. Check the example for more.`);
};

const main = async () => {
  const file = fs.readFileSync('./config.yml', 'utf8');
  invariant(
    file,
    'config.yml not found. You should probably make a copy of config-example.yml and apply your changes!'
  );
  const config = YAML.parse(file);
  invariant(config, 'Something wrong happend there wuth YAML parsing.');

  checkConfigVar(config.twilio, 'twilio');
  checkConfigVar(config.twilio.accountSid, 'twilio.accountSid');
  checkConfigVar(config.twilio.authToken, 'twilio.authToken');

  checkConfigVar(config.message, 'message');
  checkConfigVar(config.numbers, 'numbers');
  checkConfigVar(config.from, 'from');

  const { accountSid, authToken } = config.twilio;
  const client = require('twilio')(accountSid, authToken);

  const { message, numbers, from } = config;
  
  Promise.all(
    numbers.map((to) =>
      client.messages.create({
        body: message,
        from,
        to,
      })
    )
  ).then(console.log);
};

main().then(console.log);