/**
 * Created by Jackson on 10/21/16.
 */

module.exports.validate = function (check) {
    var errors = [];

    for (var i = 0; i < check.length; i++) {
        var current = check[i];

        for (var key in current.checks) {
            if (key === 'required') {
                if (current.checks['required']) {
                    if (!current.value) {
                        errors.push('Field does not exist.');
                    }
                }
            } else if (key === 'minlength') {
                if (current.value.length < current.checks['minlength']) {
                    errors.push('Field is not long enough.')
                }
            } else if (key === 'maxlength') {
                if (current.value.length > current.checks['maxlength']) {
                    errors.push('Field is too long.')
                }
            } else if (key === 'regex') {
                if (!current.checks['regex'].test(current.value)) {
                    errors.push('Field does not pass the regex.');
                }
            } else if (key === 'matches') {
                if (Array.isArray(current.checks['matches'])) {
                    var doesMatch = false;

                    for (var n = 0; n < current.checks['matches'].length; n++) {
                        if (current.value == current.checks['matches'][n]) {
                            doesMatch = true;
                            break;
                        }
                    }

                    if (!doesMatch) {
                        errors.push('Field is not a valid value.');
                    }
                } else {
                    if (current.value != current.checks['matches']) {
                        errors.push('Fields do not match.');
                    }
                }
            }
        }
    }

    return {
        passed: errors.length === 0,
        errors: errors
    }
};
