import React from 'react';
// import Consumer from '../context';

import Moment from 'moment';
import properties from './properties';

export const CommaFormatted = (amount) => {
    // console.log('comma', parseFloat(amount).toFixed(properties.decimals).toLocaleString(properties.locale, {
    //     minimumFractionDigits: 2
    // }))
    // return Number(parseFloat(amount).toFixed(properties.decimals)).toLocaleString(properties.locale, {
    //     minimumFractionDigits: 2
    // })
    amount = parseFloat(amount).toFixed(properties.decimals).toString()
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(amount))
        amount = amount.replace(pattern, "$1,$2");
    return amount;

}

export const format = (value, type) => {
    switch (type) {
        case "date":
            return Moment(value).format('DD/MM/YYYY');
            break;
        case "money":
            return `${properties.currency}${CommaFormatted(value)}`;
            break;
    }
}

export const validate = (required, $this, base) => {
    let result = {
        status: true
    }
    const fields = {};
    required.forEach(field => {
        let value;
        let name;
        if (field.indexOf(".") !== -1) {
            const names = field.split(".")
            name = names[1];
            if (base) {
                value = $this.state[base][names[0]][names[1]];
            } else {
                value = $this.state[names[0]][names[1]];
            }

        } else {
            name = field;
            if (base) {
                value = $this.state[base][field]
            } else {
                value = $this.state[field]
            }

        }
        if (!value || value.length === 0) {
            const errors = { ...$this.state.errors, [name]: true };
            fields[name] = true;
            result.status = false;
        } else {
            fields[name] = false;
        }
    });

    Object.keys($this.state.errors).filter(item => required.findIndex(it => it === item) === -1)
        .forEach(field => {
            fields[field] = false;
        });

    $this.setState({ errors: Object.assign($this.state.errors, fields) });
    return result;
}

const concat = list => Array.prototype.concat.bind(list);
const promiseConcat = f => x => f().then(concat(x));
const promiseReduce = (acc, x) => acc.then(promiseConcat(x));
export const serialPromises = funcs => funcs.reduce(promiseReduce, Promise.resolve([]));

//credit: https://gist.github.com/mikelehen/3596a30bd69384624c11
export const generatePushID = (function () {
    // Modeled after base64 web-safe chars, but ordered by ASCII.
    var PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

    // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
    var lastPushTime = 0;

    // We generate 72-bits of randomness which get turned into 12 characters and appended to the
    // timestamp to prevent collisions with other clients.  We store the last characters we
    // generated because in the event of a collision, we'll use those same characters except
    // "incremented" by one.
    var lastRandChars = [];

    return function () {
        var now = new Date().getTime();
        var duplicateTime = (now === lastPushTime);
        lastPushTime = now;

        var timeStampChars = new Array(8);
        for (var i = 7; i >= 0; i--) {
            timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
            // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
            now = Math.floor(now / 64);
        }
        if (now !== 0) throw new Error('We should have converted the entire timestamp.');

        var id = timeStampChars.join('');

        if (!duplicateTime) {
            for (i = 0; i < 12; i++) {
                lastRandChars[i] = Math.floor(Math.random() * 64);
            }
        } else {
            // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
            for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
                lastRandChars[i] = 0;
            }
            lastRandChars[i]++;
        }
        for (i = 0; i < 12; i++) {
            id += PUSH_CHARS.charAt(lastRandChars[i]);
        }
        if (id.length != 20) throw new Error('Length should be 20.');

        return id;
    };
})();