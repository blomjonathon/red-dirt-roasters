# Render Deployment Guide

This guide will help you deploy your Red Dirt Roasters application to Render.

## Prerequisites

1. A GitHub repository with your code
2. A Render account (free tier available)

## Step 1: Create a PostgreSQL Database on Render

1. **Log into Render Dashboard**
   - Go to [render.com](https://render.com)
   - Sign in to your account

2. **Create New PostgreSQL Service**
   - Click "New +" button
   - Select "PostgreSQL"
   - Choose a name (e.g., "red-dirt-roasters-db")
   - Select your preferred region
   - Choose a plan (free tier works for development)
   - Click "Create Database"

3. **Get Database Connection Details**
   - Once created, click on your database service
   - Go to "Connections" tab
   - Copy the "External Database URL"
   - This will look like: `postgresql://username:password@host:port/database_name`

## Step 2: Create Your Web Service

1. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub repository
   - Choose the repository with your code

2. **Configure the Service**
   - **Name**: `red-dirt-roasters` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Same as your database
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Choose free tier for development

3. **Set Environment Variables**
   - Click "Environment" tab
   - Add the following variables:

   ```
   DATABASE_URL=your_postgresql_connection_string_from_step_1
   NODE_ENV=production
   JWT_SECRET=your_very_long_random_secret_key_here
   ADMIN_EMAIL=admin@reddirtroasters.com
   ADMIN_PASSWORD=your_secure_admin_password
   BCRYPT_ROUNDS=12
   PORT=10000
   ```

   **Important Notes:**
   - Replace `your_postgresql_connection_string_from_step_1` with the URL from Step 1
   - Generate a strong JWT_SECRET (you can use a password generator)
   - Change the admin password to something secure
   - Render automatically sets PORT, but you can override it

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

## Step 3: Verify Deployment

1. **Check Build Logs**
   - Monitor the build process in the logs
   - Look for any errors during npm install or startup

2. **Test Your Application**
   - Once deployed, click on your service URL
   - Test the main website: `https://your-app-name.onrender.com/`
   - Test the admin panel: `https://your-app-name.onrender.com/admin.html`

3. **Check Database Connection**
   - Look at the service logs for database connection messages
   - You should see "✅ PostgreSQL connected successfully" if everything is working

## Troubleshooting Common Issues

### 1. Database Connection Failed (ECONNREFUSED)

**Symptoms:**
- Application fails to start
- Error: `ECONNREFUSED ::1:5432`

**Solutions:**
- Verify `DATABASE_URL` is set correctly in environment variables
- Ensure PostgreSQL service is running on Render
- Check that the database service is in the same region as your web service
- Wait a few minutes after creating the database - it takes time to provision

### 2. Build Failures

**Symptoms:**
- Build process fails during `npm install`

**Solutions:**
- Check that `package.json` is in the root directory
- Verify all dependencies are listed in `package.json`
- Check that Node.js version is compatible (use `>=16.0.0`)

### 3. Application Crashes on Startup

**Symptoms:**
- Build succeeds but application crashes when starting

**Solutions:**
- Check the service logs for error messages
- Verify all required environment variables are set
- Check that the start command (`npm start`) is correct

### 4. Admin Panel Not Working

**Symptoms:**
- Main website loads but admin panel shows errors

**Solutions:**
- Check that `JWT_SECRET` is set
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set
- Check database connection in logs

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | Yes | Environment mode | `production` |
| `JWT_SECRET` | Yes | Secret for JWT tokens | `long_random_string_here` |
| `ADMIN_EMAIL` | Yes | Admin user email | `admin@example.com` |
| `ADMIN_PASSWORD` | Yes | Admin user password | `secure_password_123` |
| `BCRYPT_ROUNDS` | No | Password hashing rounds | `12` |
| `PORT` | No | Server port (Render sets this) | `10000` |

## Security Best Practices

1. **Use Strong Passwords**
   - Generate a strong admin password
   - Use a password manager to store it securely

2. **Secure JWT Secret**
   - Use a long, random string for JWT_SECRET
   - At least 32 characters recommended
   - Never commit secrets to your repository

3. **Environment Variables**
   - Keep sensitive data in environment variables
   - Never hardcode secrets in your code
   - Use different values for development and production

## Scaling and Upgrades

1. **Free Tier Limitations**
   - Free tier services sleep after 15 minutes of inactivity
   - First request after sleep may take 30-60 seconds
   - Database has 1GB storage limit

2. **Upgrading to Paid Plans**
   - Consider paid plans for production use
   - Better performance and reliability
   - No sleep mode on paid plans

## Support

If you encounter issues:

1. **Check Render Documentation**: [docs.render.com](https://docs.render.com)
2. **Review Service Logs**: Look at the logs tab in your service
3. **Verify Environment Variables**: Double-check all required variables are set
4. **Test Locally**: Ensure your application works locally first

## Next Steps

After successful deployment:

1. **Set up Custom Domain** (optional)
2. **Configure SSL** (automatic on Render)
3. **Set up Monitoring** (Render provides basic monitoring)
4. **Regular Backups** (database backups are automatic on paid plans)

---

**Happy Deploying! 🚀**
