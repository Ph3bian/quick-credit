import sendgrid from '@sendgrid/mail';
import config from '../config/index';

sendgrid.setApiKey(config.sendGridKey);

export default msg => sendgrid.send({
  ...msg, from: 'hello@quickcredit.ng',
});
