// src/mock/reservationData.js
const reservations = [];

const reservationApi = {
  // 添加预约
  addReservation: (activity) => {
    const existingReservation = reservations.find(res => res.id === activity.id);
    if (!existingReservation) {
      reservations.push(activity);
    }
    return reservations;
  },
  // 获取所有预约
  getReservations: () => {
    return reservations;
  },
  // 检查是否已预约
  isReserved: (activityId) => {
    return reservations.some(res => res.id === activityId);
  }
};

export { reservationApi };