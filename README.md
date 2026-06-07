# 职链 WorkLink

面向中国团队和设计师的专业设计服务协作平台。项目使用 Next.js App Router、Prisma、PostgreSQL 和 JWT Cookie 登录。

## 本地开发

```bash
npm install
cp .env.example .env
npm run setup:local
npm run dev
```

本地种子账号：

- 客户：`client@worklink.dev` / `password123`
- 设计师：`freelancer@worklink.dev` / `password123`

## 生产环境变量

部署前必须配置：

- `DATABASE_URL`：PostgreSQL 连接串。
- `JWT_SECRET`：至少 32 位随机字符串。
- `NEXT_PUBLIC_SITE_URL`：线上完整域名，例如 `https://example.com`。

不要把本地 `.env` 上传到部署平台或代码仓库。

## 部署流程

1. 安装依赖：`npm install`
2. 生成 Prisma Client：`npm run prisma:generate`
3. 执行数据库迁移：`npm run prisma:deploy`
4. 构建：`npm run build`
5. 启动：`npm run start`

部署前可先运行：

```bash
npm run deploy:check
```

## 上线检查

- `/api/health` 返回 `{"data":{"status":"ok"}}`。
- `/robots.txt` 和 `/sitemap.xml` 可以访问。
- `/dashboard/client` 和 `/dashboard/freelancer` 未登录时会跳转登录页。
- 登录、注册、发布项目、投递报价能正常完成。
