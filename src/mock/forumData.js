// src/mock/forumData.js
export const forumPosts = [
  {
    id: 1,
    title: '这是第一个测试帖子',
    content: '这是测试帖子的内容，欢迎大家参与讨论。',
    author: 'test_user',
    createTime: '2025-06-01 10:00',
    views: 120,
    imageUrl: 'https://picsum.photos/400/400?random=1'
  },
  {
    id: 2,
    title: '商城有什么好东西推荐？',
    content: '大家在商城都买过什么好东西？可以分享一下吗？',
    author: 'user2',
    createTime: '2025-06-02 14:30',
    views: 89,
    imageUrl: 'https://picsum.photos/400/400?random=2'
  },
  {
    id: 3,
    title: '下一次活动什么时候举办？',
    content: '请问管理员，下一次线下活动什么时候举办？在哪个城市？',
    author: 'user3',
    createTime: '2025-06-05 09:15',
    views: 156,
    imageUrl: 'https://picsum.photos/400/400?random=3'
  }
];

// 模拟后端API接口
export const forumApi = {
  // 获取帖子列表
  getPosts() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...forumPosts]);
      }, 300);
    });
  },
  
  // 获取单个帖子详情
  getPostById(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const post = forumPosts.find(p => p.id === id);
        resolve(post || null);
      }, 300);
    });
  },
  
  // 创建新帖子
  createPost(postData) {
    return new Promise(resolve => {
      setTimeout(() => {
        const newId = Math.max(...forumPosts.map(p => p.id)) + 1;
        const now = new Date();
        const formattedTime = now.toISOString().slice(0, 19).replace('T', ' ');
        
        const newPost = {
          id: newId,
          title: postData.title,
          content: postData.content,
          author: postData.author,
          createTime: formattedTime,
          views: 0,
          imageUrl: postData.imageUrl
        };
        
        forumPosts.unshift(newPost);
        resolve(newPost);
      }, 300);
    });
  },

  // 更新浏览量
  updateViews(id, views) {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = forumPosts.findIndex(p => p.id === id);
        if (index !== -1) {
          forumPosts[index].views = views;
        }
        resolve(true);
      }, 300);
    });
  }
};