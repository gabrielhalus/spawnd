CREATE TABLE `tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`refresh_token` text NOT NULL,
	`issued_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`revoked_at` integer,
	`user_agent` text,
	`ip` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tokens_refresh_token_unique` ON `tokens` (`refresh_token`);