/*
  THIS TEST IS NOT UP TO DATE
  USE actionsSpec.js INSTEAD
*/

import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';
import {store} from '../../store/store.js';
import reducer from '../reducer';

describe('buyReducer', () => {
  const START_DATE = new Date();
  const END_DATE = new Date(START_DATE.getFullYear()+1);

  const initialState = fromJS({
    matches: [{
      m_id: '456',
      challengee: '123', 
      startDate: START_DATE,
      endDate: END_DATE,
      starting_funds: '1000000',
      status: 'progress',
      type: 'solo',
      winner: null,
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        available_cash: '1000000'
      },
    }],
    userId: '123',
    currentMatchId: '456'
  });

  it('handles BUY_STOCK for valid trade for a stock that isn\'t held' , () => {
    const action = {
      type: 'BUY_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [{
          stockSymbol: 'GOOG',
          shares: '10',
          price: '100'
        }],
        totalValue: '1000000',
        available_cash: '999000'
      }
    };
    const nextState = reducer(initialState, action);
    expect(nextState.get('matches').toJS()).to.deep.equal(
      //need to fill in full state expected here
      [{
        m_id: '456',
        challengee: '123', 
        startDate: START_DATE,
        endDate: END_DATE,
        starting_funds: '1000000',
        status: 'progress',
        type: 'solo',
        winner: null,
        portfolio: {
          stocks: [{
            stockSymbol: 'GOOG',
            shares: '10',
            price: '100'
          }],
          totalValue: '1000000',
          available_cash: '999000'
        }
      }]
    );
  });

  it('handles BUY_STOCK for valid trade for a stock that is already held' , () => {
    const action = {
      type: 'BUY_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [{
          price: '100',
          stockSymbol: 'GOOG',
          shares: '20'
        }],
        totalValue: '1000000',
        available_cash: '998000'
      }
    };
    const middleState = reducer(initialState, action);
    const nextState = reducer(middleState, action);
    expect(nextState.get('matches').toJS()).to.deep.equal(
      //need to fill in full state expected here
      [{
        m_id: '456',
        challengee: '123', 
        startDate: START_DATE,
        endDate: END_DATE,
        starting_funds: '1000000',
        status: 'progress',
        type: 'solo',
        winner: null,
        portfolio: {
          stocks: [{
            price: '100',
            stockSymbol: 'GOOG',
            shares: '20'
          }],
          totalValue: '1000000',
          available_cash: '998000'
        }
      }]
    );
  });

  it('handles BUY_STOCK for valid trade for a stock that is already held and another stock is held' , () => {
    const action = {
      type: 'BUY_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
              stocks: [{
                price: '100',
                stockSymbol: 'GOOG',
                shares: '10'
              }],
              totalValue: '1000000',
              available_cash: '999000'
            }
    };

    const action2 = {
      type: 'BUY_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [{
          price: '100',
          stockSymbol: 'GOOG',
          shares: '10'
        },
        {
          price: '100',
          stockSymbol: 'FB',
          shares: '10'
        }],
        totalValue: '1000000',
        available_cash: '998000'
      }
    };

    const action3 = {
      type: 'BUY_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [{
          price: '100',
          stockSymbol: 'GOOG',
          shares: '20'
        },
        {
          price: '100',
          stockSymbol: 'FB',
          shares: '10'
        }],
        totalValue: '1000000',
        available_cash: '997000'
      }
    }

    const state1 = reducer(initialState, action);
    const state2 = reducer(state1, action2);    
    const nextState = reducer(state2, action3);
    expect(nextState.get('matches').toJS()).to.deep.equal(
      //need to fill in full state expected here
      [{

        m_id: '456',
        challengee: '123', 
        startDate: START_DATE,
        endDate: END_DATE,
        starting_funds: '1000000',
        status: 'progress',
        type: 'solo',
        winner: null,
        portfolio: {
          stocks: [{
            price: '100',
            stockSymbol: 'GOOG',
            shares: '20'
          },
          {
            price: '100',
            stockSymbol: 'FB',
            shares: '10'
          }],
          totalValue: '1000000',
          available_cash: '997000'
        }
      }]
    );
  });

  it('does not update state for BUY_STOCK with invalid trade', () => {
    const action = {
      type: 'BAD_ACTION',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        available_cash: '1000000'
      }
    };
    const nextState = reducer(initialState, action);
    expect(nextState.get('error')).to.equal(true);
  });
});

describe('sellReducer', () => {
  const START_DATE = new Date();
  const END_DATE = new Date(START_DATE.getFullYear()+1);
  const initialState = fromJS({
    matches: [{
      m_id: '456',
      challengee: '123', 
      startDate: START_DATE,
      endDate: END_DATE,
      starting_funds: '1000000',
      status: 'progress',
      type: 'solo',
      winner: null,
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        available_cash: '1000000'
      }
    }]
  });

  it('handles SELL_STOCK for valid trade', () => {
    //need to have initial state include a stock so we can execute a valid trade
    const actionBuy = {
      type: 'BUY_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [{
          price: '100',
          stockSymbol: 'GOOG',
          shares: '10'
        }],
        totalValue: '1000000',
        available_cash: '999000'
      }
    };

    const actionSell = {
      type: 'SELL_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        available_cash: '1000000'
      }
    };
    const nextState = reducer(initialState, actionBuy);
    const finalState = reducer(nextState, actionSell);

    expect(finalState.get('matches').toJS()).to.deep.equal(
      //need to fill in full state expected here
      [{
        m_id: '456',
        challengee: '123', 
        startDate: START_DATE,
        endDate: END_DATE,
        starting_funds: '1000000',
        status: 'progress',
        type: 'solo',
        winner: null,
        portfolio: {
          stocks: [],
          totalValue: '1000000',
          available_cash: '1000000'
        }
      }]
    );
  });

  it('does not update state for SELL_STOCK with invalid trade', () => {
    const action = {
      type: 'SELL_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        available_cash: '1000000'
      }
    };
    const nextState = reducer(initialState, action);
    expect(nextState.get('matches').toJS()).to.deep.equal(
      //need to fill in full state expected here
      [{
        m_id: '456',
        challengee: '123', 
        startDate: START_DATE,
        endDate: END_DATE,
        starting_funds: '1000000',
        status: 'progress',
        type: 'solo',
        winner: null,
        portfolio: {
          stocks: [],
          totalValue: '1000000',
          available_cash: '1000000'
        }
      }]
    );
  });
});

describe('Create Match reducer', () => {
  const START_DATE = new Date();
  const END_DATE = new Date(START_DATE.getFullYear()+1);
  const initialState = fromJS({
    matches: []
  });
  it('adds a new match to the user', () => {
    const action = {
      type: 'CREATE_MATCH',
      currentMatchId: 1,
      match: {
        challengee: '123', 
        startDate: START_DATE,
        endDate: END_DATE,
        starting_funds: '1000000',
        status: 'progress',
        type: 'solo',
        winner: null,
        portfolio: {
          available_cash: 100000,
          totalValue: 100000          
        },
        MatchId: 1
      }
    };
    const nextState = reducer(initialState, action);
    expect(nextState.get('matches').count()).to.equal(1);
  });
});

describe('Join Match reducer', () => {
  const START_DATE = new Date();
  const END_DATE = new Date(START_DATE.getFullYear()+1);
  const initialState = fromJS({
    matches: []
  });
  it('adds a new match to the user', () => {
    const action = {
      type: 'JOIN_MATCH',
      currentMatchId: 1,
      match: {
        creator_id: '234',
        challengee: '123', 
        startDate: START_DATE,
        endDate: END_DATE,
        starting_funds: '1000000',
        status: 'progress',
        type: 'head',
        winner: null,
        portfolio: {
          available_cash: 100000,
          totalValue: 100000          
        },
        MatchId: 1
      }
    };
    const nextState = reducer(initialState, action);
    expect(nextState.get('matches').count()).to.equal(1);
  });
});

describe('general reducer', () => {
  const START_DATE = new Date();
  const END_DATE = new Date(START_DATE.getFullYear()+1);
  const initialState = fromJS({
    matches: [{
      m_id: '456',
      challengee: '123', 
      startDate: START_DATE,
      endDate: END_DATE,
      starting_funds: '1000000',
      status: 'progress',
      type: 'solo',
      winner: null,
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        available_cash: '1000000'
      }
    }]
  });
  it('handles unknown action type', () => {
    const initialState = Map();
    const action = {
      type: 'EAT_PANCAKES'
    };
    const nextState = reducer(initialState, action);
    expect(nextState).to.equal(initialState);
  });
});



