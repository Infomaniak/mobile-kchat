import React from 'react';
import { WithTranslation } from 'react-i18next';
interface ILogoutDialogProps extends WithTranslation {
    onLogout: Function;
}
declare const LogoutDialog: React.FC<ILogoutDialogProps>;
export default LogoutDialog;
