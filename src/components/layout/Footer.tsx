export function Footer() {
    return (
        <footer className="border-t bg-muted/50">
            <div className="container mx-auto py-8 px-4 md:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="text-lg font-semibold text-primary">Kitchen Gallery</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Delicious burgers delivered to your desk.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Links</h3>
                        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                            <li>Menu</li>
                            <li>About Us</li>
                            <li>Contact</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Legal</h3>
                        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Kitchen Gallery. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
