import { bindActionCreators } from 'redux';
export function wrapActionCreators(actionCreators) {
    return function (dispatch) {
        return bindActionCreators(actionCreators, dispatch);
    };
}
