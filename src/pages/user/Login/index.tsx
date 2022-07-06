import React from 'react';
import { history, useModel } from 'umi';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import classNames from 'classnames';
import { SelectLang } from '@/components/SelectLang';
import { login } from '@/services/api';
import { setToken } from '@/utils/storage';

import styles from './index.less';

type LoginParams = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values: LoginParams) => {
    const { access_token: token } = await login(values);
    setToken(token);
    await fetchUserInfo();
    /** 此方法会跳转到 redirect 参数所在的位置 */
    if (!history) return;
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    history.replace(redirect || '/');
  };

  return (
    <div className={classNames(styles.container, 'f f-j-end f-a-center')}>
      <div className={styles.lang} data-lang>
        <SelectLang />
      </div>
      <LoginForm
        logo={<>{t('OpenV2X Central Portal')}</>}
        onFinish={async (values) => {
          await handleSubmit(values as LoginParams);
        }}
      >
        <p>{t('Platform Login')}</p>
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <img src="/assets/images/login_user.png" />,
          }}
          placeholder={t('Username')}
          rules={[{ required: true, message: t('Please input your username') }]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <img src="/assets/images/login_password.png" />,
          }}
          placeholder={t('Password')}
          rules={[{ required: true, message: t('Please input your password') }]}
        />
      </LoginForm>
    </div>
  );
};

export default Login;