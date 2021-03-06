'use strict';

const fs = require('fs-extra');

/**
 * Module for VCAP Constants
 * @module vcap-constants
 */

const vcapApplication = JSON.parse(process.env.VCAP_APPLICATION);

const vcapConstants = {};

vcapConstants.isLocalOrCI = ['CI', 'local'].indexOf(process.env.PLATFORM) !== -1 ? true : false;

/** VCAP environment variables are used by cloud.gov to pass in instance specific settings. */
let vcapServices;
if (process.env.VCAP_SERVICES) {
  vcapServices = JSON.parse(process.env.VCAP_SERVICES);
} else {
  vcapServices = JSON.parse(fs.readFileSync('vcap-services/local-or-ci.json', 'utf8'));
  if (process.env.AWS_CONFIG) {
    vcapServices.s3 = JSON.parse(process.env.AWS_CONFIG).s3;
  } else {
    vcapServices.s3 = JSON.parse(fs.readFileSync('vcap-services/aws-config.json', 'utf8')).s3;
  }
}

const getUserProvided = function(name) {
  return vcapServices['user-provided'].find(element => {
    return element.name === name;
  });
};

/** Base URL of this instance */
vcapConstants.baseUrl = 'https://' + vcapApplication.uris[0];

/** jwt token used to generate permit confirmation URL **/
const jwt = getUserProvided('jwt');
vcapConstants.permitSecret = jwt.credentials.permit_secret;

/** S3 bucket settings */
const intakeS3 = vcapServices['s3'].find(element => {
  return element.name === 'intake-s3';
});
if (intakeS3.credentials.access_key_id && intakeS3.credentials.secret_access_key) {
  vcapConstants.accessKeyId = intakeS3.credentials.access_key_id;
  vcapConstants.secretAccessKey = intakeS3.credentials.secret_access_key;
}
vcapConstants.region = intakeS3.credentials.region;
vcapConstants.bucket = intakeS3.credentials.bucket;

/** Middle layer settings */
const middlelayerService = getUserProvided('middlelayer-service');
vcapConstants.middleLayerBaseUrl = middlelayerService.credentials.middlelayer_base_url;
vcapConstants.middleLayerUsername = middlelayerService.credentials.middlelayer_username;
vcapConstants.middleLayerPassword = middlelayerService.credentials.middlelayer_password;

/** Intake module settings */
const intakeService = getUserProvided('intake-client-service');
vcapConstants.intakeClientBaseUrl = intakeService.credentials.intake_client_base_url;

/** Login.gov settings */
const loginGovService = getUserProvided('login-service-provider');
vcapConstants.loginGovIssuer = loginGovService.credentials.issuer;
vcapConstants.loginGovJwk = loginGovService.credentials.jwk;
vcapConstants.loginGovIdpUsername = loginGovService.credentials.idp_username;
vcapConstants.loginGovIdpPassword = loginGovService.credentials.idp_password;
vcapConstants.loginGovDiscoveryUrl = loginGovService.credentials.discovery_url;

/** USDA eAuth settings */
const eAuthService = getUserProvided('eauth-service-provider');
vcapConstants.eAuthUserWhiteList = eAuthService.credentials.whitelist;
vcapConstants.eAuthIssuer = eAuthService.credentials.issuer;
vcapConstants.eAuthEntryPoint = eAuthService.credentials.entrypoint;
vcapConstants.eAuthCert = eAuthService.credentials.cert;
vcapConstants.eAuthPrivateKey = eAuthService.credentials.private_key;

/** SMTP settings */
const smtp = getUserProvided('smtp-service');
vcapConstants.smtpHost = smtp.credentials.smtp_server;
vcapConstants.smtpUsername = smtp.credentials.username;
vcapConstants.smtpPassword = smtp.credentials.password;
vcapConstants.specialUseAdminEmailAddresses = smtp.credentials.admins;

/** Pay.gov */
const payGov = getUserProvided('pay-gov');
vcapConstants.payGovUrl = payGov.credentials.url;
vcapConstants.payGovClientUrl = payGov.credentials.client_url;
vcapConstants.payGovAppId = payGov.credentials.tcs_app_id;
vcapConstants.payGovCert = payGov.credentials.certificate;
vcapConstants.payGovPrivateKey = payGov.credentials.private_key;

/**
 * VCAP Constants
 * @exports vcapConstants
 */
module.exports = vcapConstants;
