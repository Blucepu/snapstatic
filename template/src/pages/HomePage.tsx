import { Link } from "react-router-dom"
import {
  LayoutGridIcon,
  BarChart3Icon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">项目已就绪</h1>
        <p className="mt-4 text-muted-foreground">开始构建你的页面</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/dev/components">
            <Button size="lg">
              <LayoutGridIcon />
              查看组件
            </Button>
          </Link>
          <Link to="/dev/charts">
            <Button size="lg" variant="outline">
              <BarChart3Icon />
              查看图表
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
