CREATE TABLE IF NOT EXISTS `servers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`version` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
