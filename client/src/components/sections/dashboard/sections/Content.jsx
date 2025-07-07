import React from 'react';
import Account from './tabs/Account';
import Learning from './tabs/Learning';
import PreviousTests from './tabs/PreviousTests';

const Content = ({ activeTab }) => {
    return (
        <div className='p-6 overflow-auto'>
            {activeTab === 'account' && <Account />}
            {activeTab === 'learning' && <Learning />}
            {activeTab === 'tests' && <PreviousTests />}
        </div>
    );
};

export default Content;