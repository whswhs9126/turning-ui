import React from 'react';
import classNames from 'classnames';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

export type ThemeProps =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'light';

export interface IconProps extends FontAwesomeIconProps {
  theme?: ThemeProps;
}

const Icon: React.FC<IconProps> = ({ theme, className, ...resProps }) => {
  const classes = classNames(className, {
    [`icon-${theme}`]: theme,
  });
  return <FontAwesomeIcon className={classes} {...resProps}></FontAwesomeIcon>;
};

export default Icon;
