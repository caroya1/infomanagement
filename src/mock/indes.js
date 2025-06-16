// src/mock/index.js
import Mock from 'mockjs';

// 模拟活动数据
Mock.mock('/api/activities', 'get', () => {
  return [
    {
      id: 1,
      title: '夏日特惠大促销',
      image: 'https://picsum.photos/200/120?random=1',
      description: '全场商品8折起，限时抢购，数量有限！',
      startTime: '2025-06-01',
      endTime: '2025-06-15',
      status: 'ongoing',
      location: '线上商城'
    },
    {
      id: 2,
      title: '会员专属日',
      image: 'https://picsum.photos/200/120?random=2',
      description: '会员额外9折，积分翻倍，专属礼品等您拿！',
      startTime: '2025-06-10',
      endTime: '2025-06-10',
      status: 'ongoing',
      location: '全国门店'
    },
    {
      id: 3,
      title: '新品发布会',
      image: 'https://picsum.photos/200/120?random=3',
      description: '全新系列产品发布，现场体验黑科技！',
      startTime: '2025-06-20',
      endTime: '2025-06-20',
      status: 'upcoming',
      location: '上海国际会议中心'
    },
    {
      id: 4,
      title: '周年庆狂欢',
      image: 'https://picsum.photos/200/120?random=4',
      description: '满减优惠，抽奖赢免单，全场包邮！',
      startTime: '2025-05-28',
      endTime: '2025-05-30',
      status: 'ended',
      location: '线上线下同步'
    },
    {
      id: 5,
      title: '户外体验活动',
      image: 'https://picsum.photos/200/120?random=5',
      description: '专业教练指导，探索自然，挑战自我！',
      startTime: '2025-06-15',
      endTime: '2025-06-16',
      status: 'upcoming',
      location: '黄山风景区'
    }
  ];
});

// 模拟商品数据
Mock.mock('/api/products', 'get', () => {
  return [
    {
      id: 1,
      name: '高级智能手表',
      description: '具有心率监测、睡眠分析等多种功能的智能手表',
      price: 1299,
      originalPrice: 1599,
      sales: 2345,
      imageUrl: 'https://picsum.photos/400/400?random=21'
    },
    {
      id: 2,
      name: '无线蓝牙耳机',
      description: '主动降噪，高清通话，长时间续航的无线耳机',
      price: 799,
      originalPrice: 999,
      sales: 1876,
      imageUrl: 'https://picsum.photos/400/400?random=22'
    },
    {
      id: 3,
      name: '超薄笔记本电脑',
      description: '14英寸轻薄本，高性能处理器，长续航',
      price: 5699,
      originalPrice: 6299,
      sales: 987,
      imageUrl: 'https://picsum.photos/400/400?random=23'
    },
    {
      id: 4,
      name: '4K高清电视',
      description: '55英寸4K智能电视，HDR，AI语音控制',
      price: 3499,
      originalPrice: 3999,
      sales: 1234,
      imageUrl: 'https://picsum.photos/400/400?random=24'
    },
    {
      id: 5,
      name: '机械键盘',
      description: 'RGB背光，青轴机械键盘，全键无冲',
      price: 399,
      originalPrice: 499,
      sales: 3456,
      imageUrl: 'https://picsum.photos/400/400?random=25'
    },
    {
      id: 6,
      name: '游戏鼠标',
      description: '可编程按键，高精度传感器，RGB灯光',
      price: 199,
      originalPrice: 249,
      sales: 4567,
      imageUrl: 'https://picsum.photos/400/400?random=26'
    },
    {
      id: 7,
      name: '便携充电宝',
      description: '20000mAh大容量，双向快充',
      price: 149,
      originalPrice: 199,
      sales: 5678,
      imageUrl: 'https://picsum.photos/400/400?random=27'
    },
    {
      id: 8,
      name: '智能音箱',
      description: '支持语音助手，智能家居控制',
      price: 249,
      originalPrice: 299,
      sales: 2345,
      imageUrl: 'https://picsum.photos/400/400?random=28'
    }
  ];
});