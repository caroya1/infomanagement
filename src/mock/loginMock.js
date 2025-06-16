const mockUsers = [
  { id: 1, username: 'admin', password: 'xinguan', userType: 'admin', token: 'admin-token' },
  { id: 2, username: 'user1', password: '123456', userType: 'user', token: 'user-token-1' },
  { id: 3, username: 'user2', password: '654321', userType: 'user', token: 'user-token-2' }
];

// 模拟API模块
export const login = async (username, password) => {
  console.log('[Mock API] 登录请求:', { username, password });
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 查找用户
  const user = mockUsers.find(
    user => user.username === username && user.password === password
  );
  
  if (user) {
    // 登录成功
    console.log('[Mock API] 登录成功:', user);
    return {
      success: true,
      code: 200,
      message: '登录成功',
      data: {
        userId: user.id,
        username: user.username,
        userType: user.userType,
        token: user.token
      }
    };
  } else {
    // 登录失败
    console.log('[Mock API] 登录失败: 用户不存在');
    return {
      success: false,
      code: 401,
      message: '用户名或密码错误'
    };
  }
};

// 模拟获取用户信息API
export const getUserInfo = async (token) => {
  console.log('[Mock API] 获取用户信息:', token);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = mockUsers.find(user => user.token === token);
  if (user) {
    return {
      success: true,
      data: {
        userId: user.id,
        username: user.username,
        userType: user.userType,
        avatar: 'https://picsum.photos/id/' + user.id + '/200/200'
      }
    };
  } else {
    return {
      success: false,
      message: '无效的token'
    };
  }
};