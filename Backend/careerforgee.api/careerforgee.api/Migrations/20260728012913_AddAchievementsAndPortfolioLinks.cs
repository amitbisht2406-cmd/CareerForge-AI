using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace careerforgee.api.Migrations
{
    /// <inheritdoc />
    public partial class AddAchievementsAndPortfolioLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          

            migrationBuilder.AddColumn<string>(
                name: "GitHubUrl",
                table: "Portfolios",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LinkedInUrl",
                table: "Portfolios",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ResumeId",
                table: "Portfolios",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
           

            migrationBuilder.DropColumn(
                name: "GitHubUrl",
                table: "Portfolios");

            migrationBuilder.DropColumn(
                name: "LinkedInUrl",
                table: "Portfolios");

            migrationBuilder.DropColumn(
                name: "ResumeId",
                table: "Portfolios");
        }
    }
}
