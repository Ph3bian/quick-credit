import sendgrid from '@sendgrid/mail';
import config from '../../config/index';

sendgrid.setApiKey(config.sendGridKey);

export default  sendEmail = (data) => {
  const msg = {
    to: data.receiver,
    from: data.sender,
  };
  sendgrid.send(msg, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Mail sent successfully');
    }
  });
};
