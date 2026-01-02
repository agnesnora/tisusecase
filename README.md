# TIS UseCase

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 0. Prerequisites

npm must be installed - I was using: 11.6.0

### 1. Install Dependencies

First, install the necessary dependencies using npm:

```bash
npm install
```

### 2.Start mock server

```
npx json-server --watch "db 1.json" --port 3001

```

### 3. Run application

#### 3.1 Run the Development Server

```
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

#### 3.2. Build for Production

To create an optimized production build, run:

```

npm run build

```

Once the build is complete, you can start the production server locally to test it:

```

npm run start


```

### 4.Testing

```
npm test
```
