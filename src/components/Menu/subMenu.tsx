import React, {
  useContext,
  FunctionComponentElement,
  useState,
  cloneElement,
} from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import Icon from '../Icon/icon';
import { MenuContext } from './menu';
import { MenuItemProps } from './menuItem';

export interface SubMenuProps {
  index?: string;
  title: string;
  className?: string;
}

const SubMenu: React.FC<SubMenuProps> = ({
  index,
  title,
  children,
  className,
}) => {
  const context = useContext(MenuContext);
  const openedSubMenus = context.defaultOpenSubMenus as Array<string>;
  const isOpend =
    index && context.mode === 'vertical'
      ? openedSubMenus.includes(index)
      : false;
  const [submenuShow, setSubmenuShow] = useState(isOpend);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSubmenuShow(!submenuShow);
  };
  let timer: any;
  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    clearTimeout(timer);
    e.preventDefault();
    timer = setTimeout(() => {
      setSubmenuShow(toggle);
    }, 100);
  };
  const clickEvents =
    context.mode === 'vertical'
      ? {
          onClick: handleClick,
        }
      : {};
  const hoverEvents =
    context.mode === 'horizontal'
      ? {
          onMouseEnter: (e: React.MouseEvent) => {
            handleMouse(e, true);
          },
          onMouseLeave: (e: React.MouseEvent) => {
            handleMouse(e, false);
          },
        }
      : {};

  const classes = classNames('menu-item submenu-item', className, {
    'is-active': context.index === index,
    'is-vertical': context.mode === 'vertical',
    'is-opened': submenuShow,
  });

  const renderChildren = () => {
    const subMenuClasses = classNames('viking-submenu', {
      'menu-opened': submenuShow,
    });
    const childrenComponent = React.Children.map(children, (child, i) => {
      const childEl = child as FunctionComponentElement<MenuItemProps>;
      if (childEl.type.displayName === 'MenuItem') {
        return cloneElement(childEl, {
          index: `${index}-${i}`,
        });
      } else {
        console.error('Warning: Menu has a child which is not a MenuItem');
      }
    });
    return (
      <CSSTransition
        in={submenuShow}
        timeout={300}
        classNames='zoom-in-top'
        appear
      >
        <ul className={subMenuClasses}>{childrenComponent}</ul>;
      </CSSTransition>
    );
  };
  return (
    <li key={index} className={classes} {...hoverEvents}>
      <div className='submenu-title' {...clickEvents}>
        {title}
        <Icon icon='angle-down' className='arrow-icon'></Icon>
      </div>
      {renderChildren()}
    </li>
  );
};

SubMenu.displayName = 'SubMenu';

export default SubMenu;
