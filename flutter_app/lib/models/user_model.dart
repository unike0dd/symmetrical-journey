
enum UserRole {
  admin,
  endConsumer,
  guest,
}

class User {
  final String id;
  final String email;
  final String displayName;
  final UserRole role;

  User({
    required this.id,
    required this.email,
    required this.displayName,
    required this.role,
  });
}
