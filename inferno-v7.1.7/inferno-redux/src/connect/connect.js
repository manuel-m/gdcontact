import { connectAdvanced } from '../components/connectAdvanced';
import { shallowEqual } from '../utils/shallowEqual';
import { defaultMapDispatchToPropsFactories } from './mapDispatchToProps';
import { defaultMapStateToPropsFactories } from './mapStateToProps';
import { defaultMergePropsFactories } from './mergeProps';
import { defaultSelectorFactory } from './selectorFactory';
import { combineFrom } from 'inferno-shared';
const match = (arg, factories, name) => {
    for (let i = factories.length - 1; i >= 0; i--) {
        const result = factories[i](arg);
        if (result) {
            return result;
        }
    }
    return (_dispatch, options) => {
        throw new Error(`Invalid value of type ${typeof arg} for ${name} argument when connecting component ${options.wrappedComponentName}.`);
    };
};
const strictEqual = (a, b) => a === b;
// createConnect with default args builds the 'official' connect behavior. Calling it with
// different options opens up some testing and extensibility scenarios
export const createConnect = ({ connectHOC = connectAdvanced, mapStateToPropsFactories = defaultMapStateToPropsFactories, mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories, mergePropsFactories = defaultMergePropsFactories, selectorFactory = defaultSelectorFactory } = {}) => (mapStateToProps, mapDispatchToProps, mergeProps, { pure = true, areStatesEqual = strictEqual, areOwnPropsEqual = shallowEqual, areStatePropsEqual = shallowEqual, areMergedPropsEqual = shallowEqual, ...extraOptions } = {}) => {
    const initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
    const initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
    const initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');
    return connectHOC(selectorFactory, combineFrom({
        // used in error messages
        methodName: 'connect',
        // used to compute Connect's displayName from the wrapped component's displayName.
        // tslint:disable-next-line:object-literal-sort-keys
        getDisplayName: name => `Connect(${name})`,
        // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
        shouldHandleStateChanges: !!mapStateToProps,
        // passed through to selectorFactory
        areMergedPropsEqual,
        areOwnPropsEqual,
        areStatePropsEqual,
        areStatesEqual,
        initMapDispatchToProps,
        initMapStateToProps,
        initMergeProps,
        pure
    }, extraOptions /* any extra options args can override defaults of connect or connectAdvanced */));
};
export const connect = createConnect();
