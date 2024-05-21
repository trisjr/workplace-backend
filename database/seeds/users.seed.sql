INSERT INTO
  users (
    "id",
    "createdAt",
    "updatedAt",
    "email",
    "password",
    "firstName",
    "lastName",
    "phone",
    "role"
  )
VALUES
  (
    'f59d0748-d455-4465-b0a8-8d8260b1c877',
    now(),
    now(),
    'hungvo@tenomad.com',
    crypt('admin123', gen_salt('bf', 8));,
    'Hung',
    'Vo',
    '+84123456789'
    'admin'
  );