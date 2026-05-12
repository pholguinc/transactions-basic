CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    phone varchar(30),

    password_hash text NOT NULL,

    status varchar(20) NOT NULL DEFAULT 'ACTIVE',

    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp,
    last_login_at timestamp,

    CONSTRAINT users_status_check
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'BLOCKED'))
);

CREATE TABLE transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id uuid NOT NULL,

    amount numeric(12,2) NOT NULL,
    currency varchar(10) DEFAULT 'PEN',
    description text,

    status varchar(20) NOT NULL DEFAULT 'PENDING',

    tracking_id varchar(50) UNIQUE,

    processing_attempts integer DEFAULT 0,
    last_error text,

    fraud_score numeric(5,2),
    fraud_checked_at timestamp,

    approved_at timestamp,
    rejected_at timestamp,

    receipt_path text,
    receipt_generated_at timestamp,

    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp,

    CONSTRAINT transactions_status_check
        CHECK (status IN ('PENDING', 'PROCESSING', 'APPROVED', 'REJECTED')),

    CONSTRAINT fk_transactions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);