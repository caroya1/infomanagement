# Spring Boot 后端接口文档

## 基础信息
- **基础URL**: `http://localhost:8080`
- **认证方式**: Bearer Token (JWT)
- **内容类型**: `application/json`
- **字符编码**: UTF-8

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {} // 具体数据
}
```

### 错误响应
```json
{
  "success": false,
  "code": 400,
  "message": "错误信息描述",
  "data": null
}
```

## 1. 认证接口

### 1.1 用户登录
- **接口**: `POST /auth/login`
- **描述**: 用户登录获取token
- **请求参数**:
```json
{
  "username": "string", // 用户名，必填
  "password": "string"  // 密码，必填
}
```
- **响应示例**:
```json
{
  "success": true,
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 1,
    "username": "test_user",
    "userType": "user", // user: 普通用户, admin: 管理员
    "nickname": "测试用户",
    "email": "test@example.com"
  }
}
```

### 1.2 获取用户信息
- **接口**: `GET /auth/userinfo`
- **描述**: 根据token获取当前用户信息
- **请求头**: `Authorization: Bearer {token}`
- **响应示例**:
```json
{
  "success": true,
  "code": 200,
  "message": "获取成功",
  "data": {
    "userId": 1,
    "username": "test_user",
    "nickname": "测试用户",
    "email": "test@example.com",
    "phone": "13800138000",
    "gender": "other",
    "userType": "user",
    "createTime": "2025-06-01 10:00:00"
  }
}
```

### 1.3 用户退出
- **接口**: `POST /auth/logout`
- **描述**: 用户退出登录
- **请求头**: `Authorization: Bearer {token}`
- **响应示例**:
```json
{
  "success": true,
  "code": 200,
  "message": "退出成功",
  "data": null
}
```

## 2. 论坛接口

### 2.1 获取帖子列表
- **接口**: `GET /forum/posts`
- **描述**: 获取论坛帖子列表
- **请求参数** (Query参数):
  - `page`: 页码，默认1
  - `size`: 每页大小，默认10
  - `keyword`: 搜索关键字，可选
- **响应示例**:
```json
{
  "success": true,
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "title": "这是第一个测试帖子",
      "content": "这是测试帖子的内容，欢迎大家参与讨论。",
      "author": "test_user",
      "authorId": 1,
      "createTime": "2025-06-01 10:00:00",
      "updateTime": "2025-06-01 10:00:00",
      "views": 120,
      "imageUrl": "https://picsum.photos/400/400?random=1"
    }
  ]
}
```

### 2.2 获取帖子详情
- **接口**: `GET /forum/posts/{id}`
- **描述**: 根据ID获取帖子详情
- **路径参数**: `id` - 帖子ID
- **响应示例**:
```json
{
  "success": true,
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "title": "这是第一个测试帖子",
    "content": "这是测试帖子的内容，欢迎大家参与讨论。",
    "author": "test_user",
    "authorId": 1,
    "createTime": "2025-06-01 10:00:00",
    "updateTime": "2025-06-01 10:00:00",
    "views": 121,
    "imageUrl": "https://picsum.photos/400/400?random=1"
  }
}
```

### 2.3 创建帖子
- **接口**: `POST /forum/posts`
- **描述**: 创建新帖子
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**:
```json
{
  "title": "string",    // 帖子标题，必填，3-100字符
  "content": "string",  // 帖子内容，必填，10-5000字符
  "imageUrl": "string"  // 封面图片URL，可选
}
```
- **响应示例**:
```json
{
  "success": true,
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 4,
    "title": "新创建的帖子",
    "content": "帖子内容...",
    "author": "test_user",
    "authorId": 1,
    "createTime": "2025-06-16 15:30:00",
    "updateTime": "2025-06-16 15:30:00",
    "views": 0,
    "imageUrl": null
  }
}
```

### 2.4 更新帖子
- **接口**: `PUT /forum/posts/{id}`
- **描述**: 更新帖子信息
- **请求头**: `Authorization: Bearer {token}`
- **路径参数**: `id` - 帖子ID
- **请求参数**:
```json
{
  "title": "string",    // 帖子标题，必填
  "content": "string",  // 帖子内容，必填
  "imageUrl": "string"  // 封面图片URL，可选
}
```

### 2.5 删除帖子
- **接口**: `DELETE /forum/posts/{id}`
- **描述**: 删除帖子
- **请求头**: `Authorization: Bearer {token}`
- **路径参数**: `id` - 帖子ID

### 2.6 更新浏览量
- **接口**: `POST /forum/posts/{id}/view`
- **描述**: 增加帖子浏览量
- **路径参数**: `id` - 帖子ID

## 3. 学习活动接口

### 3.1 获取活动列表
- **接口**: `GET /learning/activities`
- **描述**: 获取学习活动列表
- **请求参数** (Query参数):
  - `page`: 页码，默认1
  - `size`: 每页大小，默认10
  - `keyword`: 搜索关键字，可选
- **响应示例**:
```json
{
  "success": true,
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "title": "摄影活动预约",
      "content": "本次摄影活动将带你领略美丽的风景，学习专业的摄影技巧...",
      "author": "test_user",
      "authorId": 1,
      "createTime": "2025-06-01 10:00:00",
      "views": 120,
      "imageUrl": "https://picsum.photos/400/400?random=1",
      "reservedCount": 10,
      "maxCapacity": 50,
      "status": "active" // active: 开放预约, closed: 已关闭
    }
  ]
}
```

### 3.2 获取活动详情
- **接口**: `GET /learning/activities/{id}`
- **描述**: 根据ID获取活动详情
- **路径参数**: `id` - 活动ID

### 3.3 预约活动
- **接口**: `POST /learning/activities/{id}/reserve`
- **描述**: 预约学习活动
- **请求头**: `Authorization: Bearer {token}`
- **路径参数**: `id` - 活动ID
- **响应示例**:
```json
{
  "success": true,
  "code": 200,
  "message": "预约成功",
  "data": {
    "reservationId": 1,
    "activityId": 1,
    "userId": 1,
    "reserveTime": "2025-06-16 15:30:00"
  }
}
```

### 3.4 取消预约
- **接口**: `DELETE /learning/activities/{id}/reserve`
- **描述**: 取消活动预约
- **请求头**: `Authorization: Bearer {token}`
- **路径参数**: `id` - 活动ID

### 3.5 获取用户预约列表
- **接口**: `GET /learning/reservations`
- **描述**: 获取当前用户的预约列表
- **请求头**: `Authorization: Bearer {token}`
- **响应示例**:
```json
{
  "success": true,
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "reservationId": 1,
      "activityId": 1,
      "title": "摄影活动预约",
      "author": "test_user",
      "createTime": "2025-06-01 10:00:00",
      "reserveTime": "2025-06-16 15:30:00",
      "reservedCount": 11,
      "status": "active"
    }
  ]
}
```

### 3.6 更新活动浏览量
- **接口**: `POST /learning/activities/{id}/view`
- **描述**: 增加活动浏览量
- **路径参数**: `id` - 活动ID

## 4. 收藏接口

### 4.1 添加收藏
- **接口**: `POST /favorites`
- **描述**: 添加收藏
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**:
```json
{
  "postId": 1,           // 帖子/活动ID，必填
  "postType": "forum"    // 类型：forum(论坛帖子), learning(学习活动)
}
```

### 4.2 移除收藏
- **接口**: `DELETE /favorites/{postId}`
- **描述**: 移除收藏
- **请求头**: `Authorization: Bearer {token}`
- **路径参数**: `postId` - 帖子/活动ID

### 4.3 检查收藏状态
- **接口**: `GET /favorites/check/{postId}`
- **描述**: 检查是否已收藏
- **请求头**: `Authorization: Bearer {token}`
- **路径参数**: `postId` - 帖子/活动ID
- **响应示例**:
```json
{
  "success": true,
  "code": 200,
  "message": "获取成功",
  "data": {
    "isFavorite": true
  }
}
```

### 4.4 获取收藏列表
- **接口**: `GET /favorites`
- **描述**: 获取用户收藏列表
- **请求头**: `Authorization: Bearer {token}`
- **请求参数** (Query参数):
  - `postType`: 类型过滤，可选 (forum/learning)
- **响应示例**:
```json
{
  "success": true,
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "favoriteId": 1,
      "postId": 1,
      "postType": "forum",
      "title": "这是第一个测试帖子",
      "author": "test_user",
      "createTime": "2025-06-01 10:00:00",
      "favoriteTime": "2025-06-16 15:30:00",
      "views": 120
    }
  ]
}
```

## 5. 商城接口

### 5.1 获取商品列表
- **接口**: `GET /mall/products`
- **描述**: 获取商品列表
- **请求参数** (Query参数):
  - `page`: 页码，默认1
  - `size`: 每页大小，默认10
  - `category`: 商品分类，可选
  - `keyword`: 搜索关键字，可选
- **响应示例**:
```json
{
  "success": true,
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "高级智能手表",
      "description": "功能强大的智能手表",
      "price": 1299.00,
      "originalPrice": 1599.00,
      "stock": 100,
      "category": "electronics",
      "imageUrl": "https://picsum.photos/300/300?random=21",
      "createTime": "2025-06-01 10:00:00"
    }
  ]
}
```

### 5.2 获取商品详情
- **接口**: `GET /mall/products/{id}`
- **描述**: 根据ID获取商品详情
- **路径参数**: `id` - 商品ID

### 5.3 添加到购物车
- **接口**: `POST /mall/cart`
- **描述**: 添加商品到购物车
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**:
```json
{
  "productId": 1,    // 商品ID，必填
  "quantity": 2      // 数量，必填，默认1
}
```

### 5.4 获取购物车
- **接口**: `GET /mall/cart`
- **描述**: 获取用户购物车
- **请求头**: `Authorization: Bearer {token}`
- **响应示例**:
```json
{
  "success": true,
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "cartId": 1,
      "productId": 1,
      "name": "高级智能手表",
      "price": 1299.00,
      "quantity": 2,
      "imageUrl": "https://picsum.photos/300/300?random=21",
      "totalPrice": 2598.00
    }
  ]
}
```

## 6. 预约管理接口

### 6.1 添加预约
- **接口**: `POST /reservations`
- **描述**: 添加预约
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**:
```json
{
  "activityId": 1    // 活动ID，必填
}
```

### 6.2 获取预约列表
- **接口**: `GET /reservations`
- **描述**: 获取用户预约列表
- **请求头**: `Authorization: Bearer {token}`

### 6.3 检查预约状态
- **接口**: `GET /reservations/check/{activityId}`
- **描述**: 检查是否已预约某活动
- **请求头**: `Authorization: Bearer {token}`
- **路径参数**: `activityId` - 活动ID
- **响应示例**:
```json
{
  "success": true,
  "code": 200,
  "message": "获取成功",
  "data": {
    "isReserved": true
  }
}
```

### 6.4 取消预约
- **接口**: `DELETE /reservations/{activityId}`
- **描述**: 取消预约
- **请求头**: `Authorization: Bearer {token}`
- **路径参数**: `activityId` - 活动ID

## 7. 状态码说明

| 状态码 | 说明                   |
| ------ | ---------------------- |
| 200    | 请求成功               |
| 201    | 创建成功               |
| 400    | 请求参数错误           |
| 401    | 未授权或token无效      |
| 403    | 权限不足               |
| 404    | 资源不存在             |
| 409    | 资源冲突（如重复预约） |
| 500    | 服务器内部错误         |

## 8. 数据库表设计建议

### 用户表 (users)
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    gender ENUM('male', 'female', 'other') DEFAULT 'other',
    user_type ENUM('user', 'admin') DEFAULT 'user',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 论坛帖子表 (forum_posts)
```sql
CREATE TABLE forum_posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id BIGINT NOT NULL,
    views INT DEFAULT 0,
    image_url VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### 学习活动表 (learning_activities)
```sql
CREATE TABLE learning_activities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id BIGINT NOT NULL,
    views INT DEFAULT 0,
    image_url VARCHAR(500),
    reserved_count INT DEFAULT 0,
    max_capacity INT DEFAULT 100,
    status ENUM('active', 'closed') DEFAULT 'active',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### 收藏表 (favorites)
```sql
CREATE TABLE favorites (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    post_type ENUM('forum', 'learning') NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_favorite (user_id, post_id, post_type)
);
```

### 预约表 (reservations)
```sql
CREATE TABLE reservations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    activity_id BIGINT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (activity_id) REFERENCES learning_activities(id),
    UNIQUE KEY unique_reservation (user_id, activity_id)
);
```

### 商品表 (products)
```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    stock INT DEFAULT 0,
    category VARCHAR(50),
    image_url VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 购物车表 (cart_items)
```sql
CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_cart_item (user_id, product_id)
);
```

## 9. CORS 配置

后端需要配置 CORS 以支持前端跨域请求：

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:5173"); // Vite 默认端口
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

## 10. JWT 配置建议

```java
// JWT 工具类示例
@Component
public class JwtUtils {
    private String secret = "your-secret-key";
    private int expiration = 86400; // 24小时
    
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }
    
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```