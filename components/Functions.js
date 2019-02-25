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

// export const withContext = (Component) => (props) => {
//     return (<Consumer>{value => (
//         <Component context={value} {...props} />
//     )}</Consumer>)
// }