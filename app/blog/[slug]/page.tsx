import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Clock, ArrowLeft, ArrowRight, Twitter, Linkedin, Facebook, Bookmark, TrendingUp } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { PageFooter } from "@/components/shared/page-footer"
import { blogPosts } from "@/lib/blog-data"

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | Mailfra Blog`,
    description: post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: "article",
      publishedTime: post.publishedDate,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  const currentIndex = blogPosts.findIndex((p) => p.slug === params.slug)
  const previousPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null
  const relatedPosts = blogPosts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 3)

  return (
    <main className="min-h-screen bg-white">
      <PageHeader />

      <article className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr,320px] gap-16">
            <div className="max-w-3xl">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
                <Link href="/blog" className="hover:text-neutral-900 transition-colors font-medium">
                  Blog
                </Link>
                <span>/</span>
                <span className="text-neutral-900 capitalize font-medium">{post.category.replace("-", " ")}</span>
              </div>

              {/* Title */}
              <h1 className="font-[family-name:var(--font-crimson)] text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-8 leading-[1.1] text-balance">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 mb-12 pb-8 border-b-2 border-neutral-200">
                <div className="flex items-center gap-4">
                  <Image
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                    width={60}
                    height={60}
                    className="rounded-full ring-2 ring-neutral-100"
                  />
                  <div>
                    <p className="font-bold text-neutral-900 text-lg">{post.author.name}</p>
                    <p className="text-sm text-neutral-600">{post.author.bio}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-600 ml-auto font-medium">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-2xl">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>

              {/* Content with beautiful typography */}
              <div
                className="prose prose-xl max-w-none
                prose-headings:font-[family-name:var(--font-crimson)] prose-headings:font-bold prose-headings:text-neutral-900 prose-headings:tracking-tight
                prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:leading-tight
                prose-h3:text-3xl prose-h3:mt-12 prose-h3:mb-5 prose-h3:leading-snug
                prose-p:text-neutral-700 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-lg
                prose-a:text-neutral-900 prose-a:font-semibold prose-a:underline prose-a:decoration-2 prose-a:decoration-lime-400 hover:prose-a:decoration-neutral-900 prose-a:transition-colors
                prose-strong:text-neutral-900 prose-strong:font-bold
                prose-ul:my-8 prose-ul:space-y-3 prose-li:text-neutral-700 prose-li:leading-relaxed prose-li:text-lg
                prose-blockquote:border-l-[6px] prose-blockquote:border-lime-400 prose-blockquote:pl-8 prose-blockquote:py-4 prose-blockquote:italic prose-blockquote:text-neutral-800 prose-blockquote:text-xl prose-blockquote:font-[family-name:var(--font-crimson)] prose-blockquote:bg-lime-50 prose-blockquote:rounded-r-xl
                prose-img:rounded-2xl prose-img:my-12 prose-img:shadow-xl
                prose-code:text-neutral-900 prose-code:bg-neutral-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:font-medium"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Share Section */}
              <div className="mt-20 pt-10 border-t-2 border-neutral-200">
                <p className="text-lg font-bold text-neutral-900 mb-6">Share this article</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-100 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-100 hover:bg-[#0A66C2] hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-100 hover:bg-[#1877F2] hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg ml-auto">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-32 space-y-8">
                {/* Popular Posts */}
                <div className="bg-neutral-50 rounded-2xl p-6 border-2 border-neutral-100">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-lime-600" />
                    <h3 className="font-bold text-neutral-900 text-lg">Popular Posts</h3>
                  </div>
                  <div className="space-y-5">
                    {blogPosts.slice(0, 4).map((popularPost, index) => (
                      <Link key={popularPost.slug} href={`/blog/${popularPost.slug}`} className="group block">
                        <div className="flex gap-3">
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-200">
                            <Image
                              src={popularPost.image || "/placeholder.svg"}
                              alt={popularPost.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-neutral-900 text-sm line-clamp-2 group-hover:text-neutral-600 transition-colors leading-snug mb-1">
                              {popularPost.title}
                            </p>
                            <p className="text-xs text-neutral-500">{popularPost.readTime}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 text-white">
                  <h3 className="font-bold text-xl mb-3">Get Weekly Tips</h3>
                  <p className="text-neutral-300 text-sm mb-5 leading-relaxed">
                    Join 15,000+ professionals getting cold email insights every week.
                  </p>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-lime-400 text-neutral-900 rounded-xl font-bold hover:bg-lime-300 transition-colors text-sm"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </aside>
          </div>

          <div className="max-w-7xl mx-auto mt-24">
            <div className="grid md:grid-cols-2 gap-6">
              {previousPost && (
                <Link
                  href={`/blog/${previousPost.slug}`}
                  className="group p-8 rounded-2xl border-2 border-neutral-200 hover:border-neutral-900 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Previous Article
                  </div>
                  <h3 className="font-[family-name:var(--font-crimson)] text-2xl font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2">
                    {previousPost.title}
                  </h3>
                </Link>
              )}
              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group p-8 rounded-2xl border-2 border-neutral-200 hover:border-neutral-900 hover:shadow-xl transition-all duration-300 md:text-right"
                >
                  <div className="flex items-center justify-end gap-2 text-sm font-semibold text-neutral-500 mb-4">
                    Next Article
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <h3 className="font-[family-name:var(--font-crimson)] text-2xl font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2">
                    {nextPost.title}
                  </h3>
                </Link>
              )}
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="max-w-6xl mx-auto px-6 mt-24">
              <h2 className="text-3xl font-bold text-neutral-900 mb-10">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-neutral-100">
                      <Image
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-2">{relatedPost.readTime}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <PageFooter />
    </main>
  )
}
