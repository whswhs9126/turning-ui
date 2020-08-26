import React, { FC } from 'react';
import {
  render,
  RenderResult,
  fireEvent,
  cleanup,
  wait,
} from '@testing-library/react';
import Menu, { MenuProps } from './menu';
import MenuItem from './menuItem';
import SubMenu from './subMenu';
// dafault props test
const testDefaultProps: MenuProps = {
  defaultIndex: '0',
  className: 'test',
  onSelect: jest.fn(),
};
// vertial props test
const testVerticalProps: MenuProps = {
  defaultIndex: '0',
  mode: 'vertical',
};
// generate Menu dom
const genMenu = (props: MenuProps) => {
  return (
    <Menu {...props}>
      <MenuItem>active link1</MenuItem>
      <MenuItem disabled={true}>disabled</MenuItem>
      <MenuItem>link3</MenuItem>
      <SubMenu title='subMenu'>
        <MenuItem>dropdown1</MenuItem>
      </SubMenu>
    </Menu>
  );
};
// create css file for submenu test
const createStyleFile = () => {
  const cssFile: string = `
    .viking-submenu {
      display: none;
    }
    .viking-submenu.menu-opened {
      display: block;
    }
  `;
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = cssFile;
  return style;
};
// define global variable
let wrapper: RenderResult,
  menuEl: HTMLElement,
  activeItemEl: HTMLElement,
  disabledItemEl: HTMLElement;

describe('Menu and MenuItem component unit test', () => {
  beforeEach(() => {
    wrapper = render(genMenu(testDefaultProps));
    wrapper.container.append(createStyleFile());
    menuEl = wrapper.getByTestId('test-menu');
    activeItemEl = wrapper.getByText('active link1');
    disabledItemEl = wrapper.getByText('disabled');
  });
  it('should render correct Menu and MenuItem base on default props', () => {
    expect(menuEl).toBeInTheDocument();
    expect(menuEl).toHaveClass('viking-menu test');
    expect(menuEl.querySelectorAll(':scope > li').length).toEqual(4);
    expect(activeItemEl).toHaveClass('menu-item is-active');
    expect(disabledItemEl).toHaveClass('menu-item is-disabled');
  });
  it('click item should change active and call the the right callBack', () => {
    const thirdItemEl = wrapper.getByText('link3');
    fireEvent.click(thirdItemEl);
    expect(thirdItemEl).toHaveClass('is-active');
    expect(activeItemEl).not.toHaveClass('is-active');
    expect(testDefaultProps.onSelect).toBeCalledWith('2');
    fireEvent.click(disabledItemEl);
    expect(disabledItemEl).not.toHaveClass('is-active');
    expect(testDefaultProps.onSelect).not.toBeCalledWith('1');
  });
  it('should render vertical mode when mode is set to vertial', () => {
    cleanup();
    const wrapper = render(genMenu(testVerticalProps));
    const menuEl = wrapper.getByTestId('test-menu');
    expect(menuEl).toHaveClass('menu-vertical');
  });
  it('should show dropdown items when hover on subMenu', async () => {
    expect(wrapper.queryByText('dropdown1')).not.toBeVisible();
    const submenuEl = wrapper.getByText('subMenu');
    fireEvent.mouseEnter(submenuEl);
    await wait(() => {
      expect(wrapper.queryByText('dropdown1')).toBeVisible();
    });
    fireEvent.click(wrapper.getByText('dropdown1'));
    expect(testDefaultProps.onSelect).toHaveBeenCalledWith('3-0');
    fireEvent.mouseLeave(submenuEl);
    await wait(() => {
      expect(wrapper.queryByText('dropdown1')).not.toBeVisible();
    });
  });
});
