import React from 'react';
import Account from './tabs/Account';
import Learning from './tabs/Learning';
import PreviousTests from './tabs/PreviousTests';
import Stats from './tabs/Stats';

const Content = ({ activeTab }) => {
    return (
        <div className='p-6 overflow-auto'>
            {activeTab === 'account' && <Account />}
            {activeTab === 'learning' && <Learning />}
            {activeTab === 'tests' && <PreviousTests />}
            {activeTab === 'stats' && <Stats />}
        </div>
    );
};

export default Content;