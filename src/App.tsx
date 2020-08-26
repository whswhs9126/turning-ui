import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import MenuItem from './components/Menu/menuItem';
import Menu from './components/Menu/menu';
import SubMenu from './components/Menu/subMenu';
import Icon from './components/Icon/icon';

library.add(fas);

/*  */
function App() {
  return (
    <div className='App'>
      <Menu
        mode='horizontal'
        defaultIndex='0'
        defaultOpenSubMenus={['2']}
        onSelect={(index) => {
          console.log(index);
        }}
      >
        <MenuItem>link1</MenuItem>
        <MenuItem disabled={true}>link2</MenuItem>
        <SubMenu title='subMenu'>
          <MenuItem>dropdown2</MenuItem>
          <MenuItem>dropdown2</MenuItem>
          <MenuItem>dropdown3</MenuItem>
        </SubMenu>
        <MenuItem>link3</MenuItem>
        <MenuItem>link4</MenuItem>
      </Menu>
    </div>
  );
}

export default App;
