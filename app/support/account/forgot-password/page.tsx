export default function AccountSafetyFAQPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">I Forgot My Password</h1>
                <p className="mt-2 text-zinc-300">
                    If you can't remember your password, you will need to reset it and create
                    a new one using the <a href="#">Account Recovery</a> feature.
                </p>

                <ul>
                    <li>We strongly recommend adding an email address to your account. For more information,
                        refer to the <a href="#">Verify Your Email Address</a> and <a href="#">Keep Your Account
                            Safe</a> articles.
                    </li>
                </ul>

                <div className="mb-6 gap-6 mt-6">
                    <h2 className="text-2xl font-semibold">Reset your password using an email address</h2>
                    <p className="mt-2 text-zinc-300">
                        <ol>
                            <li>
                                Make sure to add the valid email address.
                                <p className="mt-1 text-m text-zinc-400">
                                    Select <a href="#">Forgot Password or Username?</a> on the Cubed <a
                                    href="#">Login</a> page.
                                    You will see the “Recover your Cubed Account” title on this Recovery page.
                                </p>
                            </li>

                            <li>
                                Enter your email address in the box. Press the Submit button.

                                <ul>
                                    <li>
                                        For example, if your address is "name.example@domain.com" and on the Roblox
                                        account it
                                        is "nameexample@domain.com" without the period, you will need to type it without
                                        the
                                        period.
                                    </li>
                                </ul>
                            </li>

                            <li>
                                An email with instructions will be sent to the email address that is currently
                                associated with your
                                account. Press the Reset Password button in the email.
                                <ul>
                                    <li>
                                        If, after a few minutes, the email doesn't seem to arrive, please be sure to
                                        check your junk/spam
                                        folders.
                                    </li>
                                </ul>
                            </li>

                            <li>
                                The Reset Password page will be open.
                                <ul>
                                    <li>
                                        One account: This will open a page to enter your new password.
                                    </li>
                                    <li>
                                        Multiple accounts: Select the account whose password you want to reset.
                                    </li>
                                </ul>
                            </li>

                            <li>
                                Enter and confirm your new password. Press the Submit button.
                                Make sure to create a new password. Do not use your old password or reuse a password
                                from another
                                account.
                            </li>

                        </ol>
                    </p>

                    <p className="mt-2 text-zinc-300">
                        <h2 className="text-2xl font-semibold">Reset your password using a phone number</h2>
                        <ol>
                            <li>
                                Select Forgot Password or Username? on the Roblox Login page.
                                <ul>
                                    <li>You will see the “Recover your Roblox Account” title on this Recovery page.</li>
                                </ul>
                            </li>

                            <li>
                                If you do not have an email address attached to your account, but you do have a phone
                                number, you will
                                need to click the Phone tab to reset your password via phone number.
                            </li>

                            <li>
                                Select your country code.
                            </li>

                            <li>
                                Enter your phone number in the Phone Number box and press Continue.
                            </li>

                            <li>
                                Select Verify and complete the process. This will send a 6-digit number to your phone.
                            </li>

                            <li>
                                Enter the Code (6-digit) number in the box. Press the Verify button.
                            </li>

                            <li>
                                The Reset Password page will be open
                                <ul>
                                    <li>
                                        One account: This will open a page to enter your new password.
                                    </li>
                                    <li>
                                        Multiple accounts: Select the account whose password you want to reset.
                                    </li>
                                </ul>
                            </li>

                            <li>
                                Enter and confirm your new password. Press the Submit button.
                            </li>
                        </ol>
                    </p>

                    <p className="mt-2 text-zinc-300">
                        <h2 className="text-2xl font-semibold">Still having trouble?</h2>
                        <ul>
                            <li><a href="#">Troubleshoot technical issues</a></li>
                            <li>
                                If you didn’t add an email address or phone number to your account, and try to reset
                                your password, you
                                can’t reset your password with this feature.
                                <ul>
                                    <li>
                                        Contact Customer Support describing your login issue in detail. All players must verify ownership of an
                                        account before it can be reset or any information changed.
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </p>

                    <p className="mt-2 text-zinc-300">
                        <h2 className="text-2xl font-semibold">Adding Security</h2>
                        <p>
                            Make sure that you have enabled 2-Step Verification (2SV) as an added security measure to keep others
                            out of your account. See our Add 2-Step Verification to Your Account for information on how to enable
                            it.
                        </p>
                    </p>
                </div>
            </div>
        </div>
    );
}

