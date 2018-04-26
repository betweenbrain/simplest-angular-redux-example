import angular from 'angular'
import ngRedux from 'ng-redux'

CounterController.$inject = ['$scope', '$ngRedux']
function CounterController ($scope, $ngRedux) {
  // Map Redux state to component scope
  function mapStateToThis (state) {
    return {
      value: state.count
    }
  }
  // Map Redux actions to component scope
  function mapDispatchToThis (dispatch) {
    return {
      onIncreaseClick: () => dispatch(increaseAction),
      onDecreaseClick: () => dispatch(decreaseAction)
    }
  }

  const unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this)
  $scope.$on('$destroy', unsubscribe)
}

function counterComponent () {
  return {
    restrict: 'E',
    controllerAs: 'counter',
    controller: CounterController,
    template: `<div>
      <span>{{counter.value}}</span>
      <button ng-click="counter.onIncreaseClick()">Increase</button>
      <button ng-click="counter.onDecreaseClick()">Decrease</button>
    </div>`,
    scope: {}
  }
}
// Action
const increaseAction = {type: 'increase'}
const decreaseAction = {type: 'decrease'}

// Reducer
function counterReducer (state = {count: 0}, action) {
  let count = state.count
  switch (action.type) {
    case 'increase':
      return {count: count + 1}
    case 'decrease':
      return {count: count - 1}
    default:
      return state
  }
}

angular.module('counter', [ngRedux])
  .config(['$ngReduxProvider', ($ngReduxProvider) => {
    // create Redux Store
    $ngReduxProvider.createStoreWith(counterReducer)
  }])
  .directive('counterComponent', counterComponent)
