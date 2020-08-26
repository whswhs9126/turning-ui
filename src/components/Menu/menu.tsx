import React, { createContext, useState, cloneElement } from 'react';
import { MenuItemProps } from './menuItem';
import classNames from 'classnames';

type MenuMode = 'horizontal' | 'vertical';
type onSelectCallBack = (selectedIndex: string) => void;

export type MenuProps = {
  defaultIndex?: string;
  className?: string;
  mode?: MenuMode;
  style?: React.CSSProperties;
  onSelect?: onSelectCallBack;
  defaultOpenSubMenus?: string[];
};

interface IMenuContext {
  index: string;
  onSelect?: onSelectCallBack;
  mode?: MenuMode;
  defaultOpenSubMenus?: string[];
}

export const MenuContext = createContext<IMenuContext>({ index: '0' });

const Menu: React.FC<MenuProps> = (props) => {
  const {
    className,
    mode,
    style,
    children,
    defaultIndex,
    onSelect,
    defaultOpenSubMenus,
  } = props;
  const [currentActive, setCurrentActive] = useState(defaultIndex || '0');
  const classes = classNames('viking-menu', className, {
    'menu-vertical': mode === 'vertical',
    'menu-horizontal': mode !== 'vertical',
  });
  const handleClick = (index: string) => {
    setCurrentActive(index);
    if (onSelect) {
      onSelect(index);
    }
  };

  const passedContext: IMenuContext = {
    index: currentActive,
    onSelect: handleClick,
    mode,
    defaultOpenSubMenus,
  };
  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      const childEl = child as React.FunctionComponentElement<MenuItemProps>;
      const { displayName } = childEl.type;
      if (displayName === 'MenuItem' || displayName === 'SubMenu') {
        return cloneElement(childEl, {
          index: index.toString(),
        });
      } else {
        console.error('Warning: Menu has a child which is not a MenuItem');
      }
    });
  };

  return (
    <ul className={classes} style={style} data-testid='test-menu'>
      <MenuContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  );
};

Menu.defaultProps = {
  defaultIndex: '0',
  mode: 'horizontal',
  defaultOpenSubMenus: [],
};

export default Menu;
