// src/mock/learningData.js
export const learningActivities = [
  {
    id: 1,
    title: '摄影活动预约',
    content: '本次摄影活动将带你领略美丽的风景，学习专业的摄影技巧...',
    author: 'test_user',
    createTime: '2025-06-01 10:00',
    views: 120,
    imageUrl: 'https://picsum.photos/400/400?random=1',
    reservedCount: 10
  },
  {
    id: 2,
    title: '相机镜头讲座预约',
    content: '相机镜头的选择对于摄影效果有着很大的影响，本次讲座为你详细介绍...',
    author: 'user2',
    createTime: '2025-06-02 14:30',
    views: 89,
    imageUrl: 'https://picsum.photos/400/400?random=2',
    reservedCount: 5
  }
];

// 模拟后端API接口
export const learningApi = {
  // 获取活动列表
  getActivities() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...learningActivities]);
      }, 300);
    });
  },
  
  // 获取单个活动详情
  getActivityById(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const activity = learningActivities.find(p => p.id === id);
        resolve(activity || null);
      }, 300);
    });
  },
  
  // 预约活动
  reserveActivity(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = learningActivities.findIndex(p => p.id === id);
        if (index !== -1) {
          learningActivities[index].reservedCount++;
        }
        resolve(true);
      }, 300);
    });
  },

    // 更新浏览量
  updateViews(id, views) {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = learningActivities.findIndex(p => p.id === id);
        if (index !== -1) {
          learningActivities[index].views = views;
        }
        resolve(true);
      }, 300);
    });
  }
};