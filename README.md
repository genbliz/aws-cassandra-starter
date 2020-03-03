# SETTING UP CASSANDRA FOR AWS MSC AND NODE JS

## STEPS
* Generate Service-Specific AWS Credentials, [Instructions here](https://docs.aws.amazon.com/mcs/latest/devguide/accessing.html)
* Some useful (cqlsh) info [here](https://docs.aws.amazon.com/mcs/latest/devguide/cqlsh.html)
* Download the Amazon digital certificate to the root directory of your app: \
 ```curl https://www.amazontrust.com/repository/AmazonRootCA1.pem -O ```
* Install packages: \
  npm install cassandra-driver dotenv uuid
