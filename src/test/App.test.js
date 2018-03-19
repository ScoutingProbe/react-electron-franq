import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from '../containers/AppContainer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppContainer />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('changes language')
it('changes region')
it('watches league of legends client')
it('unwatches league of legends client')
it('recommends picks')
it('recommends bans')
it('recommends evades')

it('recommends picks for team mate selected champion')
it('recommends evades for team mate selected champion')
it('recommends picks for team mate hovered champion')
it('recommends bans for team mate hovered champion')
it('recommends evades for team mate hovered champion')
it('recommends picks for enemy selected champion')
it('recommends evades for enemy selected champion')
it('recommends picks for enemy hovered champion')
it('recommends evades for enemy hovered champion')

it('shows team mate name')
it('shows team mate role')
it('shows team mate game count in role')
it('shows team mate ranked bracket')
it('shows team mate selected champion')
it('shows team mate mastery level with selected champion')
it('shows team mate hovered champion')
it('shows team mate mastery level with hovered champion')

it('shows enemy selected champion')
it('shows enemy hovered champion')

it('shows banned champions')
it('shows message from client')
it('shows message from lolcounter')