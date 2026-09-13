const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    components: {
      securitySchemes: {
        sessionAuth: {
          type: "apiKey",
          in: "cookie",
          name: "sessionId",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
          required: ["message"],
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            login: {
              type: "string",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
            },
          },
        },
        UserFull: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            login: {
              type: "string",
            },
            email: {
              type: "string",
              format: "email",
            },
            fullName: {
              type: "string",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
            },
          },
        },
        Post: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            title: {
              type: "string",
            },
            content: {
              type: "string",
            },
            authorId: {
              type: "string",
              format: "uuid",
            },
            status: {
              type: "string",
              enum: ["active", "locked", "inactive"],
            },
            categories: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Category",
              },
            },
            publishDate: {
              type: "string",
              format: "date-time",
            },
          },
        },
        PostsList: {
          type: "object",
          properties: {
            posts: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Post",
              },
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            title: {
              type: "string",
            },
            description: {
              type: "string",
            },
          },
        },
        CategoriesList: {
          type: "object",
          properties: {
            categories: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Category",
              },
            },
          },
        },
        Comment: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            content: {
              type: "string",
            },
            status: {
              type: "string",
              enum: ["active", "inactive"],
            },
            authorId: {
              type: "string",
              format: "uuid",
            },
            postId: {
              type: "string",
              format: "uuid",
            },
            publishDate: {
              type: "string",
              format: "date-time",
            },
          },
        },
        CommentsList: {
          type: "object",
          properties: {
            comments: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Comment",
              },
            },
          },
        },
        Like: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            type: {
              type: "string",
              enum: ["like", "dislike"],
            },
            authorId: {
              type: "string",
              format: "uuid",
            },
            postId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
            commentId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
            publishDate: {
              type: "string",
              format: "date-time",
            },
          },
        },
        LikesList: {
          type: "object",
          properties: {
            likes: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Like",
              },
            },
          },
        },
        UsersList: {
          type: "object",
          properties: {
            users: {
              type: "array",
              items: {
                $ref: "#/components/schemas/User",
              },
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              format: "uuid",
            },
          },
        },
        ConfirmRegistrationResponse: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              format: "uuid",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["login", "email", "password", "password_confirmation", "fullName"],
          properties: {
            login: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            password_confirmation: { type: "string" },
            fullName: { type: "string" },
          },
        },
        ConfirmRegistrationRequest: {
          type: "object",
          required: ["email", "confirm_token"],
          properties: {
            email: { type: "string", format: "email" },
            confirm_token: { type: "string" },
          },
        },
        LoginRequest: {
          type: "object",
          properties: {
            login: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        CreatePasswordUpdateIntentRequest: {
          type: "object",
          required: ["email", "new_password"],
          properties: {
            email: { type: "string", format: "email" },
            new_password: { type: "string" },
          },
        },
        UpdatePasswordRequest: {
          type: "object",
          required: ["email", "confirm_token"],
          properties: {
            email: { type: "string", format: "email" },
            confirm_token: { type: "string" },
          },
        },
        CreateUserRequest: {
          type: "object",
          required: ["login", "email", "password", "fullName", "role"],
          properties: {
            login: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            fullName: { type: "string" },
            role: { type: "string", enum: ["user", "admin"] },
          },
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            login: { type: "string" },
            email: { type: "string", format: "email" },
            fullName: { type: "string" },
          },
        },
        CreatePostRequest: {
          type: "object",
          required: ["title", "content"],
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            categories: {
              type: "array",
              items: { type: "string", format: "uuid" },
            },
          },
        },
        UpdatePostRequest: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            status: { type: "string", enum: ["active", "locked", "inactive"] },
            categories: {
              type: "array",
              items: { type: "string", format: "uuid" },
            },
          },
        },
        CreateCommentRequest: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string" },
            postId: { type: "string", format: "uuid" },
          },
        },
        UpdateCommentRequest: {
          type: "object",
          properties: {
            content: { type: "string" },
            status: { type: "string", enum: ["active", "inactive"] },
          },
        },
        CreatePostLikeRequest: {
          type: "object",
          required: ["type"],
          properties: {
            type: { type: "string", enum: ["like", "dislike"] },
          },
        },
        CreateCommentLikeRequest: {
          type: "object",
          required: ["type"],
          properties: {
            type: { type: "string", enum: ["like", "dislike"] },
          },
        },
        CreateCategoryRequest: {
          type: "object",
          required: ["title", "description"],
          properties: {
            title: { type: "string" },
            description: { type: "string" },
          },
        },
        UpdateCategoryRequest: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
          },
        },
      },
    },
    security: [],
  },
  apis: [
    "./src/features/auth/controller.js",
    "./src/features/users/controller.js",
    "./src/features/posts/controller.js",
    "./src/features/comments/controller.js",
    "./src/features/likes/controller.js",
    "./src/features/categories/controller.js",
    "./src/features/gacha/controller.js",
    "./src/features/awards/controller.js",
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
