to generate a secret hash in a terminal window just inpit and run the string:
require('crypto').randomBytes(64).toString('hex')