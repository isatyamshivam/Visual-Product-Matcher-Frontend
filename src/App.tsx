import ProductMatcher from "./components/ProductMatcher";

const App = () => {
  return (
    <div className="min-h-screen bg-primary-50/30 text-primary-700">
      <header className="border-b border-primary-100/60 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="Visual Product Matcher Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-primary-700 sm:text-3xl">
                Visual Product Matcher
              </h1>
              <p className="text-sm text-primary-600/90">
                Discover catalogue items that look like your inspiration photo.
              </p>
            </div>
          </div>
          <a
            href="https://linktr.ee/isatyamshivam"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-gradient-to-r from-primary-200/80 via-primary-100 to-primary-50 px-4 py-2 text-sm font-medium text-primary-700 shadow-soft transition hover:from-primary-200 hover:via-primary-100 hover:to-primary-100"
          >
            Developer's Details
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        <ProductMatcher />
      </main>
    </div>
  );
};

export default App;
