# backend

## external dependencies

### postgres v15

```
CREATE TABLE "User" (
  "id" SERIAL4 PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "city" VARCHAR(255) NOT NULL,
  "country" VARCHAR(255) NOT NULL,
  "favoriteSport" VARCHAR(255) NOT NULL
);
```
