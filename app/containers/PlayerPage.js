// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Player from '../components/Player';
import * as PlayerActions from '../actions/player';

function mapStateToProps(state) {
  return {
    player: state.player
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PlayerActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);
