import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    toastr: service('toast'),
    session: service(),
    media: service(),

    isValid(username, password) {
        if (username === undefined || username === '' && password === undefined || password === '') {
            this.toastr.warning('Please enter something', 'Warning');
            return false
        }
        return true
    },

    actions: {
        authenticate() {
            try {
                let { username, password } = this.getProperties('username', 'password');
                if (this.isValid(username, password)) {
                    this.get('session').authenticate('authenticator:oauth2', username, password).then(() => {
                        setTimeout(() => {
                            document.location.reload();
                        }, 100);
                    })
                        .catch((reason) => {
                        this.set('errorMessage', reason.error || reason);
                        this.toastr.error('Password or username is wrong', 'Error');
                    });
                }
            } catch (error) {
                if (error) {
                    this.toastr.error('Password or username is wrong', 'Error');
                }
            }
        },
        redirect() {
            this.send('authenticate');
        }
    }
});
