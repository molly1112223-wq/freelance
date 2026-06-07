# Craft 上线 MVP 说明文档

## 项目定位

Craft 是一个自由职业者服务交易平台，连接真实需求方与经过认证的专业自由职业者。当前版本聚焦 MVP 闭环：注册登录、发布项目、提交报价、接受报价、创建合约、提交交付物、客户验收、双方评价。

这个版本已经移除浏览器本地预览和 demo 数据兜底，用户操作会写入数据库。

## 已实现的真实功能

- 客户注册、登录、退出
- 自由职业者注册、登录、退出
- 客户发布图文项目需求
- 项目列表实时读取数据库
- 项目详情实时读取数据库
- 自由职业者提交报价
- 客户查看报价队列
- 客户接受或拒绝报价
- 接受报价后自动创建合约
- 自由职业者提交交付物
- 客户验收交付物并完成项目
- 合约完成后提交评价
- 自由职业者评分和完成项目数更新
- 客户工作台展示真实项目、报价、合约和待评价数量
- 自由职业者工作台展示真实投递、意向金额、合约和推荐项目
- 人才列表和人才详情读取真实自由职业者资料
- API 权限校验，报价、合约、交付物不会向无权限用户公开

## 核心用户流程

### 客户流程

1. 访问 `/register` 注册客户账号
2. 登录后进入客户工作台 `/dashboard/client`
3. 进入 `/projects` 发布项目需求
4. 等待自由职业者提交报价
5. 在项目详情页查看报价队列
6. 接受合适的报价
7. 系统自动创建合约
8. 等待自由职业者提交交付物
9. 验收交付物，项目状态变为已完成
10. 给自由职业者提交评价

### 自由职业者流程

1. 访问 `/register` 注册自由职业者账号
2. 登录后进入自由职业者工作台 `/dashboard/freelancer`
3. 进入 `/projects` 浏览招募中的项目
4. 在项目详情页提交报价
5. 客户接受报价后，合约自动生成
6. 在项目详情页提交交付物
7. 等待客户验收
8. 项目完成后给客户提交评价

## 核心页面

- `/`：Craft 首页
- `/projects`：项目列表与项目发布
- `/projects/[id]`：项目详情、报价、合约、交付、验收、评价
- `/freelancers`：自由职业者列表
- `/freelancers/[id]`：自由职业者详情
- `/login`：登录
- `/register`：注册
- `/dashboard/client`：客户工作台
- `/dashboard/freelancer`：自由职业者工作台
- `/api/health`：数据库健康检查

## 技术栈

- Next.js App Router
- React
- TypeScript
- Prisma
- PostgreSQL
- JWT Cookie 登录
- Tailwind CSS
- Lucide React 图标

## 生产环境变量

上线前必须配置：

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/craft?schema=public"
JWT_SECRET="至少 32 位的随机字符串"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

要求：

- `DATABASE_URL` 必须指向生产 PostgreSQL 数据库
- `JWT_SECRET` 生产环境必须至少 32 位
- 不要把 `.env` 上传到仓库
- `NEXT_PUBLIC_SITE_URL` 必须是线上完整域名

## 部署流程

```bash
npm install
npm run prisma:generate
npm run prisma:deploy
npm run build
npm run start
```

上线前检查：

```bash
npm run typecheck
npm run lint
npm run build
```

## 本地真实数据库测试

项目提供 SQLite 本地 schema，方便在不连接生产数据库时跑真实流程：

```bash
DATABASE_URL="file:./dev.db" JWT_SECRET="dev-secret-change-me-at-least-32-characters" npm run setup:local
DATABASE_URL="file:./dev.db" JWT_SECRET="dev-secret-change-me-at-least-32-characters" npm run dev
```

本地测试账号由 seed 创建：

- 客户：`client@worklink.dev` / `password123`
- 自由职业者：`freelancer@worklink.dev` / `password123`

## 上线验收清单

- `/api/health` 返回 `status: ok`
- 新客户可以注册并登录
- 新自由职业者可以注册并登录
- 客户可以发布项目
- 项目出现在 `/projects`
- 自由职业者可以提交报价
- 客户可以接受报价
- 系统创建合约
- 自由职业者可以提交交付物
- 客户可以验收交付物
- 项目状态变为已完成
- 客户可以提交评价
- 自由职业者评分更新
- 未登录用户不能发布项目或提交报价
- 非项目客户不能查看完整报价队列
- 非合约双方不能查看合约和交付物

## 当前 MVP 边界

当前版本已经跑通交易闭环，但以下能力仍可作为下一阶段增强：

- 实名认证审核后台
- 真实支付托管
- 文件上传存储服务
- 私信/订单沟通
- 邮件通知
- 管理员工作台
- 自由职业者资料编辑页
- 项目编辑与关闭操作的完整 UI
- 更细的风控和内容审核
